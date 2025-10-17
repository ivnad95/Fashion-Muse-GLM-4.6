import { describe, it, expect } from 'vitest';
import { validateFileType, validateFileSize, sanitizeFilename } from '../file-validation';

describe('File Validation', () => {
  describe('validateFileType', () => {
    it('should accept valid image types', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileType(file);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid file types', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      const result = validateFileType(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateFileSize', () => {
    it('should accept files under size limit', () => {
      const file = new File(['x'.repeat(1000)], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileSize(file);
      expect(result.valid).toBe(true);
    });

    it('should reject files over size limit', () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const file = new File([largeContent], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileSize(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });
  });

  describe('sanitizeFilename', () => {
    it('should sanitize dangerous filenames', () => {
      const result = sanitizeFilename('../../../etc/passwd');
      expect(result).not.toContain('..');
      expect(result).not.toContain('/');
    });

    it('should preserve file extension', () => {
      const result = sanitizeFilename('my-image.jpg');
      expect(result).toMatch(/\.jpg$/);
    });

    it('should make filename unique', () => {
      const result1 = sanitizeFilename('test.jpg');
      const result2 = sanitizeFilename('test.jpg');
      expect(result1).not.toBe(result2);
    });
  });
});
