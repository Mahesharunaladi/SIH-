# Email Configuration Guide

## Setup Gmail for Email Verification

To enable email verification, you need to configure SMTP credentials in your `.env` file.

### For Gmail (Recommended):

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", enable "2-Step Verification"
4. Follow the prompts to set it up with your phone

#### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select "Mail" as the app
3. Select "Other" as the device and name it "HerbTrace"
4. Click "Generate"
5. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

#### Step 3: Update .env File
Open `/backend/.env` and update these values:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
EMAIL_FROM=noreply@herbtrace.com
EMAIL_FROM_NAME=HerbTrace
FRONTEND_URL=http://localhost:5175
```

**Important**: 
- Remove spaces from the app password
- Use your actual Gmail address
- The password is NOT your regular Gmail password
- Keep the app password secure (don't commit to git)

#### Step 4: Restart Backend Server
```bash
cd backend
npm run dev
```

You should see: "Email service initialized" instead of the authentication error.

---

## Alternative: Use Other SMTP Services

### SendGrid:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Mailgun:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your_mailgun_username
EMAIL_PASSWORD=your_mailgun_password
```

### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

---

## Testing Email Verification

### 1. Register a New User
- Open: http://localhost:5175/register
- Fill in the form with a real email address
- Submit the form

### 2. Check Your Email
- Look for: "Verify Your Email Address - HerbTrace"
- Click the "Verify Email" button

### 3. Verify Success
- You'll be redirected to the verification success page
- See a green checkmark and success message
- Auto-redirect to login after 5 seconds

### 4. Try Logging In
- Before verification: You'll get an error
- After verification: Login should work

---

## Troubleshooting

### "Invalid login: Username and Password not accepted"
- Make sure you're using an App Password, not your regular password
- Verify 2FA is enabled on your Gmail account
- Check that there are no spaces in the password

### "Email service connection failed"
- Check if EMAIL_HOST and EMAIL_PORT are correct
- Verify firewall isn't blocking port 587
- Try port 465 with EMAIL_SECURE=true

### No Email Received
- Check spam/junk folder
- Verify EMAIL_FROM is a valid email format
- Check backend logs for errors
- Test with a different email provider

### Frontend URL Not Working
- Update FRONTEND_URL in .env to match your Vite port
- Current frontend is on: http://localhost:5175
- Restart backend after changing .env

---

## Email Preview

### Verification Email:
```
Subject: Verify Your Email Address - HerbTrace

[Green Header with Herb Icon]

Hello [Name]!

Thank you for registering with HerbTrace. 
Please verify your email address by clicking the button below:

[Verify Email Button]

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.
```

### Welcome Email (after verification):
```
Subject: Welcome to HerbTrace!

Hello [Name]!

Your email has been verified successfully!

You can now access your dashboard and start using HerbTrace.

[Get Started Button]
```

---

## Security Notes

1. **Never commit .env file to Git**
   - Already in .gitignore
   - Keep credentials secure

2. **App Passwords are safer**
   - Limited to email only
   - Can be revoked anytime
   - Doesn't expose main password

3. **Token Security**
   - Tokens are cryptographically random (32 bytes)
   - Expire after 24 hours
   - One-time use only

4. **Rate Limiting**
   - Max 5 verification emails per day per user
   - Prevents spam and abuse

---

## Current Status

✅ Backend server running on: http://localhost:5001
✅ Frontend server running on: http://localhost:5175
✅ Database migration completed
⚠️  Email credentials need to be configured

Update the `.env` file with your Gmail App Password to enable email sending!
