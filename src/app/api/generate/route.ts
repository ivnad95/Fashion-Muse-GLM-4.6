import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// CONFIGURATION
// ==========================================
const GEMINI_CONFIG = {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: "gemini-2.5-flash-image-preview",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    maxRetries: 3,
    initialDelay: 1000
};

// ==========================================
// STUDIO LIGHTING SETUPS
// ==========================================
const LIGHTING_SETUPS = [
    "soft diffused key light from 45 degrees with fill light, creating gentle shadows and even skin tones",
    "dramatic Rembrandt lighting with strong side light creating a triangle of light on the cheek",
    "butterfly lighting with light directly in front and above, creating a butterfly shadow under the nose",
    "split lighting with light from one side, creating dramatic contrast between light and shadow sides",
    "loop lighting with the light 30-45 degrees to the side and slightly above eye level",
    "broad lighting illuminating the side of the face turned toward the camera",
    "rim lighting from behind creating a glowing edge outline around the model",
    "clamshell lighting with lights above and below for beauty-style even illumination"
];

// ==========================================
// STUDIO BACKGROUNDS
// ==========================================
const STUDIO_BACKGROUNDS = [
    "seamless pure white infinity background with subtle gradient",
    "clean light gray backdrop with soft shadows",
    "minimalist off-white studio cyclorama",
    "pristine white paper backdrop with gentle roll-off",
    "soft cream-colored seamless background",
    "neutral beige studio backdrop with smooth texture",
    "bright white high-key photography setup",
    "subtle warm white studio environment"
];

// ==========================================
// ENHANCED CAMERA ANGLE PROMPTS
// ==========================================
const CAMERA_VARIATIONS = [
    {
        name: "Hero Low Angle",
        prompt: "a dramatic low-angle shot from below, full-body view with the model standing in a powerful, confident stance with legs slightly apart and shoulders back, looking directly at the camera with authority",
        focalLength: "35mm lens for slight heroic distortion",
        aperture: "f/4 for full-body sharpness"
    },
    {
        name: "Beauty Close-Up",
        prompt: "an intimate close-up beauty shot, focusing on the model's face and upper shoulders, with a soft, natural expression, eyes engaging directly with the camera, capturing fine details and skin texture",
        focalLength: "85mm portrait lens",
        aperture: "f/2.8 for beautiful bokeh and subject separation"
    },
    {
        name: "Editorial Side Glance",
        prompt: "a medium shot from the waist up, with the model's body facing slightly to the side at a 45-degree angle while looking back towards the camera over their shoulder, creating an elegant editorial look",
        focalLength: "50mm standard lens",
        aperture: "f/3.5 for balanced depth"
    },
    {
        name: "Over-Shoulder Depth",
        prompt: "an over-the-shoulder perspective shot with shallow depth of field, the model looking back towards the camera with head turned, creating a sense of mystery and three-dimensional depth",
        focalLength: "50mm lens",
        aperture: "f/2.0 for shallow depth of field"
    },
    {
        name: "High Angle Elegance",
        prompt: "a high-angle shot looking down at the model who is seated or reclining elegantly, with knees together and hands placed gracefully, looking up at the camera with a serene, confident expression",
        focalLength: "50mm lens from above",
        aperture: "f/4 for sufficient depth"
    },
    {
        name: "Profile Silhouette",
        prompt: "a perfect profile view (90-degree side angle) of the model standing straight with chin slightly lifted, capturing their complete silhouette from head to toe with strong posture and clean lines",
        focalLength: "85mm for flattering compression",
        aperture: "f/5.6 for full profile sharpness"
    },
    {
        name: "Environmental Wide",
        prompt: "a wide, full-length establishing shot showing the model's entire body within the studio environment, positioned using the rule of thirds, with the model in a natural, relaxed standing pose",
        focalLength: "35mm wide angle",
        aperture: "f/5.6 for environmental context"
    },
    {
        name: "Dynamic Motion",
        prompt: "a dynamic action shot capturing the model in mid-stride walking confidently towards the camera, with one leg forward, arms in natural walking motion, conveying energy and movement with slight motion blur in clothing",
        focalLength: "50mm standard lens",
        aperture: "f/4 with fast shutter to freeze motion"
    }
];

// ==========================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ==========================================
async function fetchWithBackoff(url: string, options: RequestInit, retries = GEMINI_CONFIG.maxRetries, delay = GEMINI_CONFIG.initialDelay): Promise<Response> {
    try {
        return await fetch(url, options);
    } catch (err: any) {
        if (retries > 0) {
            console.log(`Request failed, retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithBackoff(url, options, retries - 1, delay * 2);
        }
        throw new Error(`Request failed after ${GEMINI_CONFIG.maxRetries} retries: ${err.message}`);
    }
}

// ==========================================
// SINGLE IMAGE GENERATION
// ==========================================
async function generateSingleImage(base64ImageData: string, variation: any, index: number): Promise<string> {
    // Select lighting and background for this variation
    const lighting = LIGHTING_SETUPS[index % LIGHTING_SETUPS.length];
    const background = STUDIO_BACKGROUNDS[index % STUDIO_BACKGROUNDS.length];
    
    const prompt = `You are an elite professional fashion photographer shooting for a high-end fashion catalog in a pristine photography studio.

REFERENCE IMAGE ANALYSIS:
Study the uploaded image carefully and extract:
- The EXACT facial features, face shape, skin tone, and facial structure
- The EXACT hairstyle, hair color, and hair texture
- The EXACT clothing items, colors, patterns, textures, and fit
- The model's body proportions and build

CRITICAL PRESERVATION REQUIREMENTS:
✓ FACE: Maintain 100% facial likeness - same eyes, nose, mouth, jawline, cheekbones, and facial expressions
✓ HAIR: Keep the exact hairstyle, color, length, and texture
✓ CLOTHING: Preserve every detail of the outfit - same colors, fabrics, fit, wrinkles, and styling
✓ BODY: Maintain the model's body type, proportions, and build
✓ SKIN: Keep the same skin tone, texture, and any visible features

STUDIO ENVIRONMENT (MUST CHANGE):
✗ BACKGROUND: Replace with ${background}
✗ LIGHTING: Apply professional ${lighting}
- Studio should look pristine, clean, and professional
- No props, furniture, or distracting elements
- Pure minimalist photography studio aesthetic

CAMERA SETUP:
- Camera Angle & Pose: ${variation.prompt}
- Lens: ${variation.focalLength}
- Aperture: ${variation.aperture}
- Shot Name: ${variation.name}

TECHNICAL PHOTOGRAPHY REQUIREMENTS:
- Ultra-high resolution: 4K/8K quality
- Photorealistic rendering with accurate physics
- Sharp focus on the model with perfect clarity
- Professional color grading: natural, balanced, magazine-quality
- Proper exposure: no blown highlights or crushed shadows
- Realistic skin texture: pores, natural texture, no over-smoothing
- Accurate fabric rendering: realistic cloth physics and texture
- Natural shadows and highlights from the lighting setup
- Professional depth of field appropriate for the shot type
- No AI artifacts, warping, or unnatural distortions
- Perfectly rendered hands and fingers if visible
- Natural eye reflections (catchlights) from studio lighting

REALISM CHECKLIST:
✓ Anatomically accurate proportions
✓ Realistic muscle tension and body mechanics
✓ Natural fabric draping and wrinkles
✓ Proper weight distribution in pose
✓ Believable interaction with gravity
✓ Professional model posing and body language
✓ Natural facial expressions and microexpressions
✓ Realistic hair movement and behavior
✓ Accurate light interaction with surfaces
✓ Professional photography depth and dimension

OUTPUT: Generate a flawless, photorealistic professional studio portrait that looks indistinguishable from a real photograph taken by a master fashion photographer. The image should be so realistic that it could be published in Vogue, Harper's Bazaar, or any top fashion magazine without question.`;

    const payload = {
        contents: [{
            parts: [
                { text: prompt },
                { 
                    inlineData: { 
                        mimeType: "image/png", 
                        data: base64ImageData 
                    } 
                }
            ]
        }],
        generationConfig: { 
            responseModalities: ['IMAGE'],
            temperature: 0.3, // Lower temperature for more consistent, realistic results
            topP: 0.9,
            topK: 40
        },
    };
    
    const apiUrl = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`;
    
    try {
        console.log(`Generating image ${index + 1}: ${variation.name}...`);
        console.log(`  - Lighting: ${lighting}`);
        console.log(`  - Background: ${background}`);
        console.log(`  - API URL: ${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent`);
        console.log(`  - API Key length: ${GEMINI_CONFIG.apiKey.length}`);
        
        const response = await fetchWithBackoff(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            
            let errorMessage = `API request failed with status ${response.status}`;
            if (errorData.error) {
                if (errorData.error.message) {
                    errorMessage = errorData.error.message;
                } else if (errorData.error.details) {
                    errorMessage = errorData.error.details;
                }
            }
            
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log(`Raw response for image ${index + 1}:`, JSON.stringify(result, null, 2));
        
        const candidate = result?.candidates?.[0];
        
        if (!candidate) {
            throw new Error('No candidates in response');
        }
        
        console.log(`Candidate ${index + 1} finish reason: ${candidate.finishReason}`);
        
        // Check for safety blocks
        if (candidate?.finishReason === 'SAFETY') {
            throw new Error('Image generation blocked by safety filters');
        }
        
        if (candidate?.finishReason === 'RECITATION') {
            throw new Error('Image generation blocked due to recitation concerns');
        }
        
        if (candidate?.finishReason === 'MAX_TOKENS') {
            throw new Error('Generation stopped due to maximum token limit');
        }
        
        // Extract image data
        const imageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        
        if (imageData) {
            console.log(`✓ Successfully generated image ${index + 1}: ${variation.name}`);
            return `data:image/png;base64,${imageData}`;
        } else {
            const finishReason = candidate?.finishReason;
            const textResponse = candidate?.content?.parts?.find(p => p.text)?.text;
            let errorMessage = "No image data in response";
            
            if (finishReason && finishReason !== "STOP") {
                errorMessage = `Generation failed: ${finishReason}`;
            } else if (textResponse) {
                errorMessage = `API returned text instead of image: ${textResponse.substring(0, 100)}`;
            }
            
            console.error(`Image extraction error for ${index + 1}:`, {
                finishReason,
                hasText: !!textResponse,
                textPreview: textResponse?.substring(0, 100),
                partsCount: candidate?.content?.parts?.length
            });
            
            throw new Error(errorMessage);
        }

    } catch (error: any) {
        console.error(`✗ Failed to generate image ${index + 1} (${variation.name}):`, {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// ==========================================
// MAIN GENERATION FUNCTION
// ==========================================
async function generatePhotoshoot(base64ImageData: string, numberOfImages = 8) {
    // Validate input
    if (!base64ImageData) {
        throw new Error("No image data provided");
    }
    
    if (numberOfImages < 1 || numberOfImages > 8) {
        throw new Error("Number of images must be between 1 and 8");
    }
    
    // Select the requested number of camera variations
    const selectedVariations = CAMERA_VARIATIONS.slice(0, numberOfImages);
    
    console.log(`Generating ${numberOfImages} professional studio images with Gemini...`);
    
    // Generate all images in parallel
    const generationPromises = selectedVariations.map((variation, index) => 
        generateSingleImage(base64ImageData, variation, index)
    );
    
    // Wait for all to complete (some may fail)
    const results = await Promise.allSettled(generationPromises);
    
    // Process results
    const successfulImages: Array<{
        index: number;
        name: string;
        imageUrl: string;
        prompt: string;
    }> = [];
    const failedImages: Array<{
        index: number;
        name: string;
        error: string;
    }> = [];
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            successfulImages.push({
                index,
                name: selectedVariations[index].name,
                imageUrl: result.value,
                prompt: selectedVariations[index].prompt
            });
        } else {
            failedImages.push({
                index,
                name: selectedVariations[index].name,
                error: result.reason.message
            });
        }
    });
    
    console.log(`Generation complete: ${successfulImages.length} succeeded, ${failedImages.length} failed`);
    
    return {
        successful: successfulImages,
        failed: failedImages,
        total: numberOfImages
    };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, image, numberOfImages = 1, apiKey, useUserAccount, userId } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    let geminiApiKey = "";
    
    if (useUserAccount && userId) {
      // For authenticated users, we would typically retrieve their API key from the database
      // For now, we'll use the environment variable as a fallback
      // In a real implementation, you would store and retrieve the user's Google API tokens
      geminiApiKey = process.env.GEMINI_API_KEY || "";
      
      if (!geminiApiKey) {
        return NextResponse.json(
          { error: 'Google account authentication is not fully configured. Please contact support.' },
          { status: 400 }
        );
      }
      
      console.log(`Using API key for authenticated user: ${userId}`);
    } else {
      // Use provided API key or fallback to environment variable
      geminiApiKey = apiKey || process.env.GEMINI_API_KEY;
      
      if (!geminiApiKey) {
        return NextResponse.json(
          { error: 'Gemini API key is required. Please set it in settings or sign in with Google.' },
          { status: 400 }
        );
      }
      
      console.log('Using manual API key');
    }

    // Update the config with the provided API key
    GEMINI_CONFIG.apiKey = geminiApiKey;

    // Extract base64 data from the image object
    let base64ImageData = image;
    if (typeof image === 'object' && image.data) {
      base64ImageData = image.data;
    }

    // Remove data URL prefix if present
    if (base64ImageData.startsWith('data:')) {
      base64ImageData = base64ImageData.split(',')[1];
    }

    console.log('Starting photoshoot generation...');
    console.log('Number of images requested:', numberOfImages);
    console.log('Base64 data length:', base64ImageData.length);
    console.log('API Key provided:', !!geminiApiKey);
    console.log('API Key length:', geminiApiKey.length);

    const results = await generatePhotoshoot(base64ImageData, numberOfImages);

    return NextResponse.json({
      success: true,
      results: results,
      message: `Generated ${results.successful.length} out of ${results.total} images successfully`
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate images',
        details: error.message 
      },
      { status: 500 }
    );
  }
}