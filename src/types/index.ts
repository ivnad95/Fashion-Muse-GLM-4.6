/**
 * Core type definitions for Fashion Muse Studio
 * 
 * These types provide type safety across the application
 */

// ==========================================
// Image & Upload Types
// ==========================================

export interface UploadedImage {
  url: string;
  file: File;
}

export type AspectRatio = "portrait" | "square" | "landscape";

// ==========================================
// Generation Types
// ==========================================

export interface GenerationProgress {
  done: number;
  total: number;
}

export interface GenerationResult {
  index: number;
  imageUrl: string | null;
  error?: string;
  name?: string;
}

export interface GenerationRequest {
  image: string;           // Base64 encoded
  numberOfImages: number;  // 1-8
  aspectRatio?: AspectRatio;
  apiKey?: string;
  useUserAccount?: boolean;
  userId: string;
}

export interface GenerationResponse {
  success: boolean;
  generationId?: string;
  results?: {
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
  error?: string;
}

// ==========================================
// Database Types (extends Prisma types)
// ==========================================

export interface Generation {
  id: string;
  userId: string;
  originalUrl: string;
  imageCount: number;
  aspectRatio: string;
  prompt: string;
  style?: string;
  cameraAngle?: string;
  lighting?: string;
  resultUrls: string;      // JSON string
  status: GenerationStatus;
  errorMessage?: string;
  processingTime?: number;
  modelUsed: string;
  isFavorite: boolean;
  isPublic: boolean;
  views: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type GenerationStatus = 
  | "pending" 
  | "processing" 
  | "completed" 
  | "failed" 
  | "cancelled";

export interface UserSettings {
  id: string;
  userId: string;
  displayName?: string;
  aspectRatio: AspectRatio;
  blurStrength: number;
  theme: "light" | "dark" | "auto";
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// UI State Types
// ==========================================

export type TabType = "home" | "results" | "history" | "settings";

export interface UIState {
  currentTab: TabType;
  lightboxImage: string | null;
  showUpgradeModal: boolean;
  showDeleteConfirm: string | null;
  sidebarOpen: boolean;
  theme: "light" | "dark" | "auto";
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ==========================================
// Socket.IO Event Types
// ==========================================

export interface SocketGenerationStarted {
  generationId: string;
  total: number;
}

export interface SocketGenerationProgress {
  generationId: string;
  done: number;
  total: number;
  percentage: number;
}

export interface SocketImageReady {
  generationId: string;
  index: number;
  imageUrl: string;
  name: string;
}

export interface SocketGenerationCompleted {
  generationId: string;
  results: GenerationResult[];
  processingTime: number;
}

export interface SocketGenerationError {
  generationId: string;
  error: string;
  failedIndex?: number;
}

// ==========================================
// Filter & Query Types
// ==========================================

export interface GenerationFilters {
  status?: GenerationStatus;
  favorite?: boolean;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface GenerationQuery extends GenerationFilters {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// ==========================================
// Error Types
// ==========================================

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class GenerationError extends AppError {
  constructor(message: string) {
    super(message, "GENERATION_ERROR", 500);
    this.name = "GenerationError";
  }
}
