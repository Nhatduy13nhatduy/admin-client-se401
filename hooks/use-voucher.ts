import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from '@/lib/fetch';
import {
  VoucherDto,
  CreateVoucherDto,
  UpdateVoucherDto,
  VoucherQueryParams,
  ImportVoucherDto,
} from '@/type/voucher';

const mapVoucherToApiParams = (params?: VoucherQueryParams): any => {
  if (!params) return {};

  return {
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Search: params.search,
    OrderBy: params.sortBy,
    SortOrder: params.sortOrder,
  };
};

export const useVoucher = () => {
  // Get all vouchers with pagination and filters
  const onGetVouchers = async (params?: VoucherQueryParams) => {
    try {
      const apiParams = mapVoucherToApiParams(params);
      const queryString = new URLSearchParams(
        Object.entries(apiParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();

      const url = `/api/vouchers${queryString ? `?${queryString}` : ''}`;

      const response = await getRequest({ endPoint: url });
      return response;
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      return [];
    }
  };

  // Get a single voucher by ID
  const onGetVoucherById = async (id: string) => {
    try {
      const response = await getRequest({
        endPoint: `/api/vouchers/${id}`,
      });
      return response;
    } catch (error) {
      console.error(`Error fetching voucher with ID ${id}:`, error);
      throw error;
    }
  };

  // Create a new voucher
  const onCreateVoucher = async (voucherData: CreateVoucherDto) => {
    try {
      const response = await postRequest({
        endPoint: '/api/vouchers',
        formData: voucherData,
        isFormData: false,
      });
      return response;
    } catch (error) {
      console.error('Error creating voucher:', error);
      throw error;
    }
  };

  // Update an existing voucher
  const onUpdateVoucher = async (id: string, voucherData: UpdateVoucherDto) => {
    try {
      const response = await putRequest({
        endPoint: `/api/vouchers/${id}`,
        formData: voucherData,
        isFormData: false,
      });
      return response;
    } catch (error) {
      console.error('Error updating voucher:', error);
      throw error;
    }
  };

  // Delete a voucher
  const onDeleteVoucher = async (id: string) => {
    try {
      const response = await deleteRequest({
        endPoint: `/api/vouchers/${id}`,
      });
      return response;
    } catch (error) {
      console.error('Error deleting voucher:', error);
      throw error;
    }
  };

  // Import vouchers
  const onImportVouchers = async (
    file: File,
    importFormat: 'json' | 'excel'
  ) => {
    try {
      const formData = new FormData();
      formData.append('File', file);
      formData.append('ImportFormat', importFormat);

      const response = await postRequest({
        endPoint: '/api/vouchers/import',
        formData: formData,
        isFormData: true,
      });
      return response;
    } catch (error) {
      console.error('Error importing vouchers:', error);
      throw error;
    }
  };

  return {
    onGetVouchers,
    onGetVoucherById,
    onCreateVoucher,
    onUpdateVoucher,
    onDeleteVoucher,
    onImportVouchers,
  };
};
