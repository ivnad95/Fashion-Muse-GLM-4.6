# 🔧 Technical Specifications

Detailed technical specifications for Fashion Muse Studio improvements.

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Specifications](#api-specifications)
4. [Component Structure](#component-structure)
5. [State Management](#state-management)
6. [Security Implementation](#security-implementation)
7. [Performance Optimization](#performance-optimization)

---

## 🏛️ Architecture Overview

### Current Architecture
```
┌─────────────────────────────────────────┐
│           Next.js Frontend              │
│  (React 19, TypeScript, Tailwind)       │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      Custom Node.js Server              │
│    (Next.js Handler + Socket.IO)        │
└─────────────┬───────────────────────────┘
              │
      ┌───────┴────────┐
      │                │
┌─────▼─────┐    ┌────▼────┐
│  SQLite   │    │ Gemini  │
│ Database  │    │   API   │
└───────────┘    └─────────┘
```

### Proposed Architecture
```
┌──────────────────────────────────────────────────┐
│              Next.js Frontend                    │
│     (Modular Components + Custom Hooks)          │
└──────────────┬───────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────┐
│           Custom Node.js Server                  │
│  ┌────────────┬─────────────┬─────────────────┐ │
│  │  Next.js   │  Socket.IO  │   API Routes    │ │
│  │  Handler   │   Server    │  (with Zod)     │ │
│  └────────────┴─────────────┴─────────────────┘ │
└──────────────┬───────────────────────────────────┘
               │
      ┌────────┴────────┬──────────┬─────────────┐
      │                 │          │             │
┌─────▼────┐     ┌─────▼─────┐  ┌─▼──────┐  ┌──▼────┐
│PostgreSQL│     │   Redis   │  │ Gemini │  │  S3   │
│ Database │     │  (Queue)  │  │  API   │  │Storage│
└──────────┘     └───────────┘  └────────┘  └───────┘
```

---

## 💾 Database Schema

### Updated Prisma Schema

```prisma
// Core User Management
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  generations   Generation[]
  settings      UserSettings?
  apiKeys       ApiKey[]
  
  @@index([email])
}

// OAuth Account
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

// Session Management
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// User Settings
model UserSettings {
  id           String   @id @default(cuid())
  userId       String   @unique
  displayName  String?
  aspectRatio  String   @default("portrait") // portrait, square, landscape
  blurStrength Int      @default(24)
  theme        String   @default("dark") // dark, light, auto
  language     String   @default("en")
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Encrypted API Keys (for non-authenticated users)
model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  encryptedKey String  // Encrypted with AES-256
  provider    String   @default("gemini") // gemini, openai, etc.
  isActive    Boolean  @default(true)
  lastUsed    DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, isActive])
}

// Generation History
model Generation {
  id            String   @id @default(cuid())
  userId        String
  
  // Input Data
  originalUrl   String   // URL to original uploaded image
  imageCount    Int      // Number of images requested
  aspectRatio   String   // portrait, square, landscape
  
  // Generation Details
  prompt        String   @db.Text  // Full prompt sent to API
  style         String?  // Style variation used
  cameraAngle   String?  // Camera angle used
  lighting      String?  // Lighting setup used
  
  // Results
  resultUrls    String   @db.Text  // JSON array of result URLs
  status        String   @default("pending") // pending, processing, completed, failed, cancelled
  errorMessage  String?  @db.Text
  
  // Metadata
  processingTime Int?    // Time in milliseconds
  modelUsed     String   @default("gemini-2.5-flash-image-preview")
  apiCost       Float?   // Cost in USD (if tracked)
  
  // User Actions
  isFavorite    Boolean  @default(false)
  isPublic      Boolean  @default(false)
  views         Int      @default(0)
  downloads     Int      @default(0)
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  completedAt   DateTime?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, createdAt])
  @@index([userId, isFavorite])
  @@index([userId, status])
  @@index([status, createdAt])
}

// Verification Tokens
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

### Migration Strategy

```bash
# 1. Create new models
npx prisma migrate dev --name add_user_settings_and_api_keys

# 2. Remove Post model
npx prisma migrate dev --name remove_post_model

# 3. Update Generation model
npx prisma migrate dev --name enhance_generation_model

# 4. Add indexes for performance
npx prisma migrate dev --name add_indexes
```

---

## 🔌 API Specifications

### RESTful API Endpoints

#### Generations

**POST /api/generate**
```typescript
// Request
interface GenerateRequest {
  image: string;           // Base64 encoded image
  numberOfImages: number;  // 1-8
  aspectRatio?: string;    // portrait, square, landscape
  apiKey?: string;         // Optional for non-authenticated
  useUserAccount?: boolean;
}

// Response
interface GenerateResponse {
  success: boolean;
  generationId: string;
  results: {
    successful: Array<{
      index: number;
      imageUrl: string;
      name: string;
    }>;
    failed: Array<{
      index: number;
      name: string;
      error: string;
    }>;
  };
}

// Status Codes
// 200: Success
// 400: Invalid request
// 401: Unauthorized
// 429: Rate limit exceeded
// 500: Server error
```

**GET /api/generations**
```typescript
// Query Parameters
interface GetGenerationsQuery {
  page?: number;      // Default: 1
  limit?: number;     // Default: 20, Max: 100
  status?: string;    // pending, completed, failed
  favorite?: boolean;
  startDate?: string; // ISO 8601
  endDate?: string;   // ISO 8601
  sortBy?: string;    // createdAt, updatedAt
  sortOrder?: string; // asc, desc
}

// Response
interface GetGenerationsResponse {
  success: boolean;
  generations: Generation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

**GET /api/generations/[id]**
```typescript
// Response
interface GetGenerationResponse {
  success: boolean;
  generation: Generation;
}
```

**DELETE /api/generations/[id]**
```typescript
// Response
interface DeleteGenerationResponse {
  success: boolean;
  message: string;
}
```

**POST /api/generations/[id]/favorite**
```typescript
// Request
interface FavoriteRequest {
  isFavorite: boolean;
}

// Response
interface FavoriteResponse {
  success: boolean;
  isFavorite: boolean;
}
```

#### User Settings

**GET /api/user/settings**
```typescript
// Response
interface GetSettingsResponse {
  success: boolean;
  settings: UserSettings;
}
```

**PUT /api/user/settings**
```typescript
// Request
interface UpdateSettingsRequest {
  displayName?: string;
  aspectRatio?: string;
  blurStrength?: number;
  theme?: string;
  language?: string;
}

// Response
interface UpdateSettingsResponse {
  success: boolean;
  settings: UserSettings;
}
```

#### API Keys (Secure)

**POST /api/user/api-key**
```typescript
// Request
interface StoreApiKeyRequest {
  apiKey: string;
  provider: string;
}

// Response
interface StoreApiKeyResponse {
  success: boolean;
  message: string;
}
```

**DELETE /api/user/api-key**
```typescript
// Response
interface DeleteApiKeyResponse {
  success: boolean;
  message: string;
}
```

### Socket.IO Events

**Client -> Server**
```typescript
// Join generation room
socket.emit('generation:join', { generationId: string });

// Leave generation room
socket.emit('generation:leave', { generationId: string });

// Cancel generation
socket.emit('generation:cancel', { generationId: string });
```

**Server -> Client**
```typescript
// Generation started
socket.emit('generation:started', {
  generationId: string;
  total: number;
});

// Progress update
socket.emit('generation:progress', {
  generationId: string;
  done: number;
  total: number;
  percentage: number;
});

// Single image ready
socket.emit('generation:image-ready', {
  generationId: string;
  index: number;
  imageUrl: string;
  name: string;
});

// Generation completed
socket.emit('generation:completed', {
  generationId: string;
  results: GenerationResult[];
  processingTime: number;
});

// Generation error
socket.emit('generation:error', {
  generationId: string;
  error: string;
  failedIndex?: number;
});
```

---

## 🧩 Component Structure

### Folder Organization

```
src/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts
│   │   ├── generations/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── favorite/
│   │   │           └── route.ts
│   │   ├── user/
│   │   │   ├── settings/
│   │   │   │   └── route.ts
│   │   │   └── api-key/
│   │   │       └── route.ts
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── fashion-app/
│   │   ├── FashionMuseApp.tsx
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ResultsScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── ui-elements/
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── GlassyTitle.tsx
│   │   │   ├── ImagePlaceholder.tsx
│   │   │   ├── PhoneFrame.tsx
│   │   │   └── BottomNavigation.tsx
│   │   ├── generation/
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── CountSelector.tsx
│   │   │   ├── GenerationProgress.tsx
│   │   │   ├── ResultsGrid.tsx
│   │   │   └── GenerationCard.tsx
│   │   ├── history/
│   │   │   ├── HistoryList.tsx
│   │   │   ├── HistoryCard.tsx
│   │   │   ├── HistoryFilters.tsx
│   │   │   └── HistoryPagination.tsx
│   │   └── settings/
│   │       ├── AuthSection.tsx
│   │       ├── ApiKeySection.tsx
│   │       ├── ProfileSettings.tsx
│   │       └── AppearanceSettings.tsx
│   ├── providers/
│   │   ├── session-provider.tsx
│   │   ├── socket-provider.tsx
│   │   └── query-provider.tsx
│   ├── ui/
│   │   └── [shadcn components]
│   └── error-boundary.tsx
├── hooks/
│   ├── useImageGeneration.ts
│   ├── useFileUpload.ts
│   ├── useGenerationHistory.ts
│   ├── useUserSettings.ts
│   ├── useAuth.ts
│   ├── useSocket.ts
│   └── useInfiniteScroll.ts
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── socket.ts
│   ├── utils.ts
│   ├── storage/
│   │   ├── index.ts
│   │   ├── s3.ts
│   │   ├── cloudinary.ts
│   │   └── local.ts
│   ├── errors/
│   │   ├── index.ts
│   │   └── generation-errors.ts
│   ├── logger.ts
│   ├── encryption.ts
│   ├── image-optimizer.ts
│   └── upload-validator.ts
├── middleware/
│   ├── rate-limit.ts
│   ├── validate.ts
│   └── auth.ts
├── schemas/
│   ├── generation.schema.ts
│   ├── user.schema.ts
│   └── settings.schema.ts
├── store/
│   ├── useGenerationStore.ts
│   ├── useUIStore.ts
│   └── useHistoryStore.ts
├── styles/
│   ├── glass-ui.module.css
│   ├── animations.module.css
│   └── theme.css
└── types/
    ├── index.ts
    ├── api.ts
    ├── generation.ts
    └── user.ts
```

---

## 🗄️ State Management

### Zustand Store Schemas

**Generation Store**
```typescript
// src/store/useGenerationStore.ts
interface GenerationState {
  // Current generation
  currentGeneration: {
    id: string | null;
    status: 'idle' | 'uploading' | 'generating' | 'completed' | 'failed';
    progress: { done: number; total: number };
    results: (string | null)[];
    error: string | null;
  };
  
  // Settings
  selectedCount: number;
  aspectRatio: AspectRatio;
  uploadedImage: UploadedImage | null;
  
  // Actions
  setSelectedCount: (count: number) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setUploadedImage: (image: UploadedImage | null) => void;
  startGeneration: (id: string, total: number) => void;
  updateProgress: (done: number, total: number) => void;
  addResult: (index: number, url: string) => void;
  setError: (error: string) => void;
  reset: () => void;
}
```

**UI Store**
```typescript
// src/store/useUIStore.ts
interface UIState {
  // Navigation
  currentTab: 'home' | 'results' | 'history' | 'settings';
  
  // Modals
  lightboxImage: string | null;
  showUpgradeModal: boolean;
  showDeleteConfirm: string | null; // generation ID
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
  
  // Actions
  setTab: (tab: string) => void;
  openLightbox: (url: string) => void;
  closeLightbox: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: string) => void;
}
```

**History Store**
```typescript
// src/store/useHistoryStore.ts
interface HistoryState {
  // Data
  generations: Generation[];
  selectedGeneration: Generation | null;
  
  // Pagination
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  
  // Filters
  filters: {
    status: string | null;
    favorite: boolean | null;
    dateRange: { start: Date | null; end: Date | null };
  };
  
  // Loading
  isLoading: boolean;
  isLoadingMore: boolean;
  
  // Actions
  fetchGenerations: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (filters: Partial<HistoryState['filters']>) => void;
  deleteGeneration: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  selectGeneration: (generation: Generation | null) => void;
  reset: () => void;
}
```

---

## 🔐 Security Implementation

### API Key Encryption

```typescript
// src/lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encryptApiKey(apiKey: string): {
  encrypted: string;
  iv: string;
  tag: string;
} {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

export function decryptApiKey(data: {
  encrypted: string;
  iv: string;
  tag: string;
}): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(data.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(data.tag, 'hex'));
  
  let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Rate Limiting Implementation

```typescript
// src/middleware/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 10 requests per 10 minutes for authenticated users
const authUserLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 m'),
  prefix: 'ratelimit:auth',
});

// 3 requests per 10 minutes for non-authenticated users
const guestLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  prefix: 'ratelimit:guest',
});

export async function checkRateLimit(
  identifier: string,
  isAuthenticated: boolean
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  const limiter = isAuthenticated ? authUserLimit : guestLimit;
  const result = await limiter.limit(identifier);
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: new Date(result.reset),
  };
}
```

### File Upload Validation

```typescript
// src/lib/upload-validator.ts
import sharp from 'sharp';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 4096; // 4K resolution
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

export async function validateUpload(file: File): Promise<{
  valid: boolean;
  error?: string;
  metadata?: sharp.Metadata;
}> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit',
    };
  }
  
  // Check MIME type
  if (!ALLOWED_MIMES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed',
    };
  }
  
  // Validate image with Sharp
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    
    // Check dimensions
    if (!metadata.width || !metadata.height) {
      return {
        valid: false,
        error: 'Could not read image dimensions',
      };
    }
    
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      return {
        valid: false,
        error: `Image dimensions exceed ${MAX_DIMENSION}px limit`,
      };
    }
    
    return {
      valid: true,
      metadata,
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid or corrupted image file',
    };
  }
}
```

---

## ⚡ Performance Optimization

### Image Optimization Strategy

```typescript
// src/lib/image-optimizer.ts
import sharp from 'sharp';

interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<Buffer> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 85,
    format = 'webp',
  } = options;
  
  let image = sharp(buffer);
  
  // Resize if needed
  const metadata = await image.metadata();
  if (metadata.width! > maxWidth || metadata.height! > maxHeight) {
    image = image.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }
  
  // Convert and compress
  switch (format) {
    case 'webp':
      image = image.webp({ quality });
      break;
    case 'jpeg':
      image = image.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      image = image.png({ quality, compressionLevel: 9 });
      break;
  }
  
  return image.toBuffer();
}

export async function generateThumbnail(
  buffer: Buffer,
  size: number = 300
): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toBuffer();
}
```

### Database Query Optimization

```typescript
// Efficient pagination with cursor-based approach
export async function getGenerations(
  userId: string,
  cursor?: string,
  limit: number = 20
) {
  const generations = await db.generation.findMany({
    where: {
      userId,
      ...(cursor && {
        id: {
          lt: cursor, // Cursor-based pagination
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit + 1, // Fetch one extra to check if there's more
    select: {
      id: true,
      originalUrl: true,
      resultUrls: true,
      status: true,
      isFavorite: true,
      createdAt: true,
      imageCount: true,
      // Omit large fields like prompt
    },
  });
  
  const hasMore = generations.length > limit;
  const items = hasMore ? generations.slice(0, -1) : generations;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  
  return {
    items,
    nextCursor,
    hasMore,
  };
}
```

---

## 🧪 Testing Strategy

### Unit Test Example

```typescript
// src/components/generation/__tests__/CountSelector.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CountSelector } from '../CountSelector';

describe('CountSelector', () => {
  it('renders all count options', () => {
    render(<CountSelector value={1} onChange={() => {}} />);
    
    [1, 2, 4, 6, 8].forEach((count) => {
      expect(screen.getByText(count.toString())).toBeInTheDocument();
    });
  });
  
  it('calls onChange with correct value', () => {
    const onChange = jest.fn();
    render(<CountSelector value={1} onChange={onChange} />);
    
    fireEvent.click(screen.getByText('4'));
    expect(onChange).toHaveBeenCalledWith(4);
  });
  
  it('highlights selected count', () => {
    render(<CountSelector value={4} onChange={() => {}} />);
    
    const button = screen.getByText('4').closest('button');
    expect(button).toHaveClass('active');
  });
});
```

### API Integration Test Example

```typescript
// src/app/api/__tests__/generate.test.ts
import { POST } from '../generate/route';
import { NextRequest } from 'next/server';

describe('/api/generate', () => {
  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toContain('validation');
  });
  
  it('requires authentication or API key', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        image: 'base64...',
        numberOfImages: 1,
      }),
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(401);
  });
});
```

---

## 📝 Code Style Guide

### Naming Conventions

- **Components**: PascalCase (`ImageUploader.tsx`)
- **Hooks**: camelCase with `use` prefix (`useImageGeneration.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`GenerationResult`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)

### File Organization

```typescript
// 1. Imports (grouped and sorted)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';
import type { Generation } from '@/types';

// 2. Types/Interfaces
interface ComponentProps {
  generation: Generation;
  onDelete: () => void;
}

// 3. Constants
const MAX_RETRIES = 3;

// 4. Component
export function Component({ generation, onDelete }: ComponentProps) {
  // ... implementation
}
```

### Error Handling Pattern

```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context });
  
  if (error instanceof ValidationError) {
    return { success: false, error: error.message };
  }
  
  if (error instanceof ApiError) {
    return { success: false, error: 'API request failed' };
  }
  
  return { success: false, error: 'An unexpected error occurred' };
}
```

---

This technical specification document should be updated as the project evolves and new patterns emerge.
