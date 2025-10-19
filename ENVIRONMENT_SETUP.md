# Environment Configuration Guide

## Required Environment Variables

To make the Gemini AI functionality work, you need to create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/coffee-squad

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRE=7d

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=3000

# Cloudinary Configuration (if needed)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## How to get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key and replace `your-gemini-api-key-here` in your `.env` file

## Important Notes

- Never commit your `.env` file to version control
- Make sure `.env` is in your `.gitignore` file
- Restart your server after adding the environment variables
