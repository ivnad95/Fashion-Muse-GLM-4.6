# Google Sign-In Setup for FASHION MUSE Studio

This document explains how to configure Google Sign-In for the FASHION MUSE Studio application.

## Overview

The application now supports Google Sign-In, allowing users to automatically use their own Gemini API key without manual configuration. This provides a seamless experience for users who want to use the AI fashion photography features.

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity Platform
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Select "Web application" as the application type
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local development)
   - `https://fashion-muse-studio-glm.vercel.app/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret

### 2. Environment Variables

Add the following to your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_with_openssl

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output to your `NEXTAUTH_SECRET` environment variable.

## How It Works

### For Authenticated Users
- Users sign in with their Google account
- The application automatically uses their Google account for API access
- No manual API key configuration needed
- User profile information (name, avatar, email) is automatically synced

### For Non-Authenticated Users
- Users can still use the application with manual API key configuration
- They need to provide their own Gemini API key in the settings
- This provides a fallback option for users who don't want to sign in

## User Experience

### Settings Page
- **Authenticated Users**: See their Google profile, sign-out option, and profile settings
- **Non-Authenticated Users**: See Google Sign-In button and manual API key configuration

### API Usage
- **Authenticated**: API calls are made using the user's Google account context
- **Non-Authenticated**: API calls use the manually provided API key

## Security Considerations

- All OAuth flows are handled securely through NextAuth.js
- API keys are never exposed to the client-side
- User sessions are managed securely with HTTP-only cookies
- The application follows OAuth 2.0 security best practices

## Development Notes

- The authentication state is managed through React Context (useSession hook)
- Session persistence is handled automatically by NextAuth.js
- The application gracefully handles authentication state changes
- API routes are protected and check for authentication status

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Go to Settings page
4. Click "Sign in with Google"
5. Complete the OAuth flow
6. Verify your profile information appears correctly
7. Test image generation to ensure it works with authenticated account

## Future Enhancements

- Store user's Google API tokens securely in the database
- Implement usage tracking per user
- Add subscription management
- Support for additional OAuth providers (GitHub, etc.)
- Enhanced user profile management
