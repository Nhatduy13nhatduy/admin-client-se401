export interface CategoryDto {
  id: string;
  name: string;
  description: string;
  size: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  products: any[]; // This could be refined if you have the product DTO structure
}

// Parameters for creating a new category
export interface CreateCategoryDto {
  name: string;
  description: string;
  size: string;
  type: string;
}

// Parameters for updating an existing category
export interface UpdateCategoryDto {
  name: string;
  description: string;
  size: string;
  type: string;
}

// Parameters for querying categories
export interface CategoryQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

// Specific type for paginated category response
export type PaginatedCategories = PaginatedResponse<CategoryDto>;
