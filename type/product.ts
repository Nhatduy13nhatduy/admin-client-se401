// Photo of a product
export interface ProductPhoto {
  id: string;
  url: string;
  isMain: boolean;
  publicId?: string;
}

// Category associated with a product
export interface Category {
  id: string;
  name: string;
  description: string;
  size: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  products: any[]; // This might be empty in your response
}

// Size information for a product
export interface ProductSize {
  id: string;
  size: string;
  quantity: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

// Main product type returned from API
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: number;
  mainPhotoUrl: string;
  createdAt: string;
  updatedAt: string;
  photos: ProductPhoto[];
  categories: Category[];
  sizes: ProductSize[];

  // Client-side calculated properties (may not be in API response)
  sold?: number;
  rating?: number;
  isFeatured?: boolean;
  status?: string;
}

// Parameters for creating a new product
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  inStock: number;
  categoryIds: string[];
  sizeIds?: string[];
  sizes?: {
    size: string;
    quantity: number;
  }[];
  mainImage?: File;
  additionalImages?: File[];
}

// Parameters for updating an existing product
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  inStock?: number;
  categoryIds?: string[];
}

// Parameters for querying products
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
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

// Specific type for paginated product response
export type PaginatedProducts = PaginatedResponse<Product>;
