# Gemini API Setup Instructions

## 📋 Setup Required

To use the FASHION MUSE Studio app, you need to configure your Gemini API key:

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the App
1. Open the `.env` file in the project root
2. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart the Development Server
```bash
npm run dev
```

## 🎯 Features Now Available

With the Gemini 2.5 Flash Image Preview model, the app now provides:

- **8 Professional Camera Angles**: Hero Low Angle, Beauty Close-Up, Editorial Side Glance, etc.
- **Studio Lighting Setups**: Rembrandt, Butterfly, Split, Loop, and more
- **Professional Backgrounds**: Seamless white, light gray, studio cyclorama
- **Advanced Prompts**: Detailed photography instructions for realistic results
- **Parallel Generation**: Multiple images generated simultaneously
- **Error Handling**: Retry logic with exponential backoff

## 📸 Camera Variations Included

1. **Hero Low Angle** - Dramatic low-angle full-body shot
2. **Beauty Close-Up** - Intimate close-up beauty shot
3. **Editorial Side Glance** - Medium shot with elegant side glance
4. **Over-Shoulder Depth** - Shallow depth of field perspective
5. **High Angle Elegance** - High-angle shot of seated model
6. **Profile Silhouette** - Perfect profile view
7. **Environmental Wide** - Wide establishing shot
8. **Dynamic Motion** - Action shot with movement

Each variation uses professional lighting and background combinations for maximum variety and quality.