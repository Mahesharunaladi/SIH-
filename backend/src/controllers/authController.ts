import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

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

    // Create user
    const result = await db.query(
      `INSERT INTO profiles (email, password_hash, name, role, organization, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, role, organization, created_at`,
      [email, passwordHash, name, role, organization, phone, address]
    );

    const user = result.rows[0];

    // Generate JWT token
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
        },
        token,
      },
      message: 'User registered successfully',
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
      'SELECT id, email, password_hash, name, role, organization, verified FROM profiles WHERE email = $1',
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
