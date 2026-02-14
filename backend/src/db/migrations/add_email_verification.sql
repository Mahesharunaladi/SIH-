-- Add email verification fields to profiles table

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON profiles(email_verification_token);

-- Add verification attempts tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_attempts INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_verification_attempt TIMESTAMP WITH TIME ZONE;
