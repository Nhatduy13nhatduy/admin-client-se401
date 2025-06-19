import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  patchRequest,
} from '@/lib/fetch';
import { UserDto, PhotoDto, ChangePasswordDto, UserParams } from '@/type/user';

const mapToApiParams = (params?: UserParams): any => {
  if (!params) return {};

  return {
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Search: params.search,
    OrderBy: params.orderBy,
    SortOrder: params.sortOrder,
    Role: params.role,
  };
};

export const useUser = () => {
  // Get current user (me)
  const onGetCurrentUser = async () => {
    try {
      const response = await getRequest({
        endPoint: '/api/users/me',
      });
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  };

  // Get user by ID
  const onGetUserById = async (id: string) => {
    try {
      const response = await getRequest({
        endPoint: `/api/users/${id}`,
      });
      return response;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  };

  // Get all users with pagination and filters (admin only)
  const onGetUsers = async (params?: UserParams) => {
    try {
      const apiParams = mapToApiParams(params);
      const queryString = new URLSearchParams(
        Object.entries(apiParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();

      const url = `/api/users${queryString ? `?${queryString}` : ''}`;

      const response = await getRequest({ endPoint: url });
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Change password
  const onChangePassword = async (changePasswordDto: ChangePasswordDto) => {
    try {
      const response = await patchRequest({
        endPoint: '/api/users/change-password',
        formData: changePasswordDto,
        isFormData: false,
      });
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  // Add photo for user
  const onAddPhoto = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await postRequest({
        endPoint: '/api/users/add-photo',
        formData,
        isFormData: true,
      });
      return response;
    } catch (error) {
      console.error('Error adding photo:', error);
      throw error;
    }
  };

  // Delete a photo
  const onDeletePhoto = async (photoId: string) => {
    try {
      const response = await deleteRequest({
        endPoint: `/api/users/delete-photo/${photoId}`,
      });
      return response;
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  return {
    onGetCurrentUser,
    onGetUserById,
    onGetUsers,
    onChangePassword,
    onAddPhoto,
    onDeletePhoto,
  };
};
