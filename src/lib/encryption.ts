import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // AES-GCM recommended IV size

function getKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error("ENCRYPTION_KEY environment variable is missing");
  }

  if (rawKey.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 32-byte hex string (use `openssl rand -hex 32`)");
  }

  return Buffer.from(rawKey, "hex");
}

export function encryptSecret(value: string): { encrypted: string; iv: string } {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    encrypted: Buffer.concat([encrypted, authTag]).toString("base64"),
    iv: iv.toString("base64"),
  };
}

export function decryptSecret(payload: { encrypted?: string | null; iv?: string | null }): string | null {
  if (!payload?.encrypted || !payload?.iv) {
    return null;
  }

  const key = getKey();
  const encryptedBuffer = Buffer.from(payload.encrypted, "base64");
  const iv = Buffer.from(payload.iv, "base64");

  const authTag = encryptedBuffer.slice(encryptedBuffer.length - 16);
  const ciphertext = encryptedBuffer.slice(0, encryptedBuffer.length - 16);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
