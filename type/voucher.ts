export interface VoucherDto {
  id: string;
  typeName: string;
  value: number;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
  expiredAt: string;
  isExpired: boolean;
  used?: number; // We'll calculate this client-side
}

// Parameters for creating a new voucher
export interface CreateVoucherDto {
  name: string;
  value: number;
  expiredAt: string;
  quantity: number;
}

// Parameters for updating an existing voucher
export interface UpdateVoucherDto {
  name: string;
  value: number;
  expiredAt: string;
  quantity: number;
}

// Parameters for querying vouchers
export interface VoucherQueryParams {
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

// Specific type for paginated voucher response
export type PaginatedVouchers = PaginatedResponse<VoucherDto>;

// Import voucher DTO
export interface ImportVoucherDto {
  file: File;
  importFormat: 'json' | 'excel';
}
