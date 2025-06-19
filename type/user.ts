export interface PhotoDto {
  id: string;
  url: string;
  isMain: boolean;
  publicId: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  token?: string;
  photoUrl?: string;
  photos: PhotoDto[];
  roles: string[];
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Parameters for querying users
export interface UserParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  sortOrder?: 'asc' | 'desc';
  role?: string;
}

// API response format for paginated results
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Specific type for paginated users response
export type PaginatedUsers = PaginatedResponse<UserDto>;
