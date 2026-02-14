import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { db } from '../db';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../utils/email';

// Validation schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['farmer', 'manufacturer', 'processor', 'distributor', 'retailer', 'consumer', 'admin']),
  organization: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * Register new user
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, organization, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM profiles WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      res.status(400).json({ success: false, error: 'User already exists' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const result = await db.query(
      `INSERT INTO profiles (
        email, password_hash, name, role, organization, phone, address,
        email_verified, email_verification_token, email_verification_expires
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8, $9)
       RETURNING id, email, name, role, organization, created_at`,
      [email, passwordHash, name, role, organization, phone, address, verificationToken, verificationExpires]
    );

    const user = result.rows[0];

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, name, verificationToken);
      logger.info('Verification email sent', { userId: user.id, email: user.email });
    } catch (emailError) {
      logger.error('Failed to send verification email', emailError);
      // Continue with registration even if email fails
    }

    // Generate JWT token (but user will need to verify email to access protected routes)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization,
          emailVerified: false,
        },
        token,
      },
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error: any) {
    logger.error('Registration error', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

/**
 * Login user
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, name, role, organization, verified, email_verified FROM profiles WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Check if email is verified
    if (!user.email_verified) {
      res.status(403).json({ 
        success: false, 
        error: 'Please verify your email address before logging in. Check your inbox for the verification link.',
        code: 'EMAIL_NOT_VERIFIED'
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization,
          verified: user.verified,
          emailVerified: user.email_verified,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    logger.error('Login error', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const result = await db.query(
      `SELECT id, email, name, role, organization, phone, address, verified, created_at, updated_at
       FROM profiles WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Get profile error', error);
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { name, organization, phone, address } = req.body;

    const result = await db.query(
      `UPDATE profiles 
       SET name = COALESCE($1, name),
           organization = COALESCE($2, organization),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, name, role, organization, phone, address, updated_at`,
      [name, organization, phone, address, req.user.id]
    );

    logger.info('Profile updated', { userId: req.user.id });

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    logger.error('Update profile error', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

/**
 * Verify email address with token
 */
export const verifyEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, error: 'Verification token is required' });
      return;
    }

    // Find user with matching token that hasn't expired
    const result = await db.query(
      `SELECT id, email, name, email_verified, email_verification_expires, verification_attempts
       FROM profiles 
       WHERE email_verification_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, error: 'Invalid verification token' });
      return;
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.email_verified) {
      res.status(400).json({ success: false, error: 'Email already verified' });
      return;
    }

    // Check if token has expired
    if (new Date() > new Date(user.email_verification_expires)) {
      res.status(400).json({ 
        success: false, 
        error: 'Verification token has expired. Please request a new verification email.',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }

    // Update user as verified
    await db.query(
      `UPDATE profiles 
       SET email_verified = true,
           email_verification_token = NULL,
           email_verification_expires = NULL,
           verification_attempts = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [user.id]
    );

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
      logger.info('Welcome email sent', { userId: user.id, email: user.email });
    } catch (emailError) {
      logger.error('Failed to send welcome email', emailError);
    }

    logger.info('Email verified successfully', { userId: user.id, email: user.email });

    res.json({
      success: true,
      message: 'Email verified successfully! You can now log in to your account.',
    });
  } catch (error: any) {
    logger.error('Email verification error', error);
    res.status(500).json({ success: false, error: 'Email verification failed' });
  }
};

/**
 * Resend verification email
 */
export const resendVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }

    // Find user
    const result = await db.query(
      `SELECT id, email, name, email_verified, verification_attempts
       FROM profiles 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.email_verified) {
      res.status(400).json({ success: false, error: 'Email already verified' });
      return;
    }

    // Check verification attempts (max 5 per day)
    if (user.verification_attempts >= 5) {
      res.status(429).json({ 
        success: false, 
        error: 'Maximum verification attempts reached. Please try again tomorrow.',
      });
      return;
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await db.query(
      `UPDATE profiles 
       SET email_verification_token = $1,
           email_verification_expires = $2,
           verification_attempts = verification_attempts + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [verificationToken, verificationExpires, user.id]
    );

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
      logger.info('Verification email resent', { userId: user.id, email: user.email });
    } catch (emailError) {
      logger.error('Failed to resend verification email', emailError);
      res.status(500).json({ success: false, error: 'Failed to send verification email' });
      return;
    }

    res.json({
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    });
  } catch (error: any) {
    logger.error('Resend verification error', error);
    res.status(500).json({ success: false, error: 'Failed to resend verification email' });
  }
};
