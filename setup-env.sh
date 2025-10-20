#!/bin/bash

# Fashion Muse Studio - Environment Setup Script
# This script helps you set up required environment variables for Vercel

echo "🔧 Fashion Muse Studio - Environment Setup"
echo "==========================================="
echo ""

# Generate secrets
echo "📝 Generating secrets..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

echo "✅ Secrets generated!"
echo ""

# Display the secrets
echo "🔐 Your Generated Secrets:"
echo "-------------------------"
echo ""
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

# Save to a temporary file
cat > .env.production.temp << EOF
# Generated secrets for Vercel deployment
# Copy these to Vercel Dashboard → Settings → Environment Variables

NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY

# You still need to add:
# DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
# DIRECT_DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
# NEXTAUTH_URL=https://your-app.vercel.app
# GOOGLE_CLIENT_ID=your-google-client-id (optional)
# GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
# GEMINI_API_KEY=your-gemini-api-key (optional)
EOF

echo "💾 Secrets saved to: .env.production.temp"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the secrets above"
echo "2. Go to: https://vercel.com/ivnad95/fashion-muse-glm-4-6-v2/settings/environment-variables"
echo "3. Add each variable with type 'Plain Text' for all environments"
echo "4. Also add DATABASE_URL and NEXTAUTH_URL"
echo "5. Run: vercel --prod"
echo ""
echo "⚠️  Important: Delete .env.production.temp after copying!"
