/**
 * File validation utilities for secure file uploads
 */

// Allowed MIME types for image uploads
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Maximum image dimensions
const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file type
 */
export function validateFileType(file: File): ValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }
  return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { valid: true };
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        resolve({
          valid: false,
          error: `Image dimensions exceed maximum allowed (${MAX_WIDTH}x${MAX_HEIGHT})`,
        });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Failed to load image. The file may be corrupted.',
      });
    };

    img.src = url;
  });
}

/**
 * Validate complete file
 */
export async function validateFile(file: File): Promise<ValidationResult> {
  // Check file type
  const typeResult = validateFileType(file);
  if (!typeResult.valid) {
    return typeResult;
  }

  // Check file size
  const sizeResult = validateFileSize(file);
  if (!sizeResult.valid) {
    return sizeResult;
  }

  // Check image dimensions
  const dimensionsResult = await validateImageDimensions(file);
  if (!dimensionsResult.valid) {
    return dimensionsResult;
  }

  return { valid: true };
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components
  const basename = filename.split(/[\\/]/).pop() || 'upload';
  
  // Remove special characters but keep extension
  const parts = basename.split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  const name = parts.join('.').replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return ext ? `${name}_${timestamp}_${random}.${ext}` : `${name}_${timestamp}_${random}`;
}

/**
 * Server-side file validation for API routes
 */
export function validateUploadedFile(
  fileBuffer: Buffer,
  mimeType: string,
  maxSize: number = MAX_FILE_SIZE
): ValidationResult {
  // Check file size
  if (fileBuffer.length > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }

  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType as any)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  // Basic magic number validation for common image formats
  const signatures: { [key: string]: number[][] } = {
    'image/jpeg': [[0xff, 0xd8, 0xff]],
    'image/png': [[0x89, 0x50, 0x4e, 0x47]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  };

  const signature = signatures[mimeType];
  if (signature) {
    const matches = signature.some((sig) =>
      sig.every((byte, i) => fileBuffer[i] === byte)
    );

    if (!matches) {
      return {
        valid: false,
        error: 'File content does not match declared MIME type',
      };
    }
  }

  return { valid: true };
}
