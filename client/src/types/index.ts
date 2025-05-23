// User Types
export interface User {
  id: string;
  email: string;
  companyName: string;
  websiteUrl: string;
  industry: string;
  country: string;
  linkedinProfile?: string;
  isVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  membershipTier: MembershipTier;
  membershipExpiry?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserProfile extends User {
  totalReviews: number;
  averageRatings: {
    overall: number;
    payment: number;
    communication: number;
    scope: number;
    creativeFreedom: number;
    timeliness: number;
  };
}

// Client Types
export interface Client {
  id: string;
  name: string;
  website?: string;
  industry: string;
  country: string;
  description?: string;
  averageRating: number;
  totalReviews: number;
  paymentRating: number;
  communicationRating: number;
  scopeRating: number;
  creativeFreedomRating: number;
  timelinessRating: number;
  ongoingProjects: number;
  completedProjects: number;
  canceledProjects: number;
  flagCount: number;
  isWatched: boolean;
  watchReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id: string;
  anonymousId: string;
  title?: string;
  content: string;
  projectType: string;
  budgetRange: BudgetRange;
  overallRating: number;
  paymentRating: number;
  communicationRating: number;
  scopeRating: number;
  creativeFreedomRating: number;
  timelinessRating: number;
  projectStatus: ProjectStatus;
  isPublic: boolean;
  isModerated: boolean;
  moderationStatus: ModerationStatus;
  moderationNotes?: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
}

export interface ReviewFormData {
  clientName: string;
  clientWebsite?: string;
  clientIndustry: string;
  clientCountry: string;
  title?: string;
  content: string;
  projectType: string;
  budgetRange: BudgetRange;
  overallRating: number;
  paymentRating: number;
  communicationRating: number;
  scopeRating: number;
  creativeFreedomRating: number;
  timelinessRating: number;
  projectStatus: ProjectStatus;
  isPublic: boolean;
}

// Bookmark Types
export interface Bookmark {
  id: string;
  userId: string;
  clientId: string;
  createdAt: string;
  client: Client;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  websiteUrl: string;
  industry: string;
  country: string;
  linkedinProfile?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  industry?: string;
  country?: string;
  rating?: number;
  budgetRange?: BudgetRange;
  projectStatus?: ProjectStatus;
  sortBy?: 'newest' | 'oldest' | 'rating' | 'reviews';
  page?: number;
  limit?: number;
}

export interface ClientSearchFilters {
  query?: string;
  industry?: string;
  country?: string;
  minRating?: number;
  minReviews?: number;
  isWatched?: boolean;
  sortBy?: 'name' | 'rating' | 'reviews' | 'newest';
  page?: number;
  limit?: number;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalReviews: number;
  pendingReviews: number;
  flaggedReviews: number;
  averageRating: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'review' | 'user' | 'client' | 'report';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Moderation Types
export interface ModerationReport {
  id: string;
  reason: ReportReason;
  description?: string;
  status: ModerationStatus;
  action?: ModerationAction;
  actionReason?: string;
  createdAt: string;
  resolvedAt?: string;
  review: Review;
  reporter: User;
  moderator?: User;
}

// Enums
export enum MembershipTier {
  FREE = 'FREE',
  PRO = 'PRO',
}

export enum BudgetRange {
  UNDER_5K = 'UNDER_5K',
  FIVE_TO_15K = 'FIVE_TO_15K',
  FIFTEEN_TO_50K = 'FIFTEEN_TO_50K',
  FIFTY_TO_100K = 'FIFTY_TO_100K',
  OVER_100K = 'OVER_100K',
}

export enum ProjectStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
}

export enum NotificationType {
  REVIEW_FLAGGED = 'REVIEW_FLAGGED',
  CLIENT_WATCHED = 'CLIENT_WATCHED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  MEMBERSHIP_EXPIRY = 'MEMBERSHIP_EXPIRY',
}

export enum ReportReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  FALSE_INFORMATION = 'FALSE_INFORMATION',
  SPAM = 'SPAM',
  DEFAMATORY = 'DEFAMATORY',
  VIOLATION_OF_TERMS = 'VIOLATION_OF_TERMS',
  OTHER = 'OTHER',
}

export enum ModerationAction {
  APPROVED = 'APPROVED',
  CONTENT_EDITED = 'CONTENT_EDITED',
  REVIEW_HIDDEN = 'REVIEW_HIDDEN',
  USER_WARNING = 'USER_WARNING',
  USER_SUSPENDED = 'USER_SUSPENDED',
  NO_ACTION = 'NO_ACTION',
}

// Utility Types
export type Role = 'user' | 'admin' | 'moderator';

export interface ErrorState {
  message: string;
  details?: Record<string, unknown>;
}

export interface LoadingState {
  isLoading: boolean;
  error?: ErrorState | null;
} 