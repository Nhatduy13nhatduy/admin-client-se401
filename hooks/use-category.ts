import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "@/lib/fetch";
import { type z } from "zod";
import {
  productSchema,
  updateProductSchema,
  getProductsSchema,
  type GetProductsParams,
} from "@/lib/validations/product";
import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryParams,
} from "@/type/category";

export type ProductQueryParams = {
  PageNumber?: number;
  PageSize?: number;
  Name?: string;
  Category?: string;
  MinPrice?: number;
  MaxPrice?: number;
  OrderBy?: string;
  SortBy?: string;
};

const mapToApiParams = (params?: GetProductsParams): ProductQueryParams => {
  if (!params) return {};

  return {
    PageNumber: params.page,
    PageSize: params.limit,
    Name: params.search,
    Category: params.categoryId,
    MinPrice: params.minPrice,
    MaxPrice: params.maxPrice,
    OrderBy: params.sortBy,
    SortBy: params.sortOrder,
  };
};

const mapCategoryToApiParams = (params?: CategoryQueryParams): any => {
  if (!params) return {};

  return {
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Search: params.search,
    OrderBy: params.sortBy,
    SortOrder: params.sortOrder,
  };
};

export const useProduct = () => {
  // Get all products with pagination and filters
  const onGetProducts = async (params?: GetProductsParams) => {
    try {
      const apiParams = mapToApiParams(params);
      const queryString = new URLSearchParams(
        Object.entries(apiParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();

      const url = `/api/products${queryString ? `?${queryString}` : ""}`;
      console.log("Fetching products from:", url);

      const response = await getRequest({ endPoint: url });
      console.log("Raw API response:", response);

      // The API returns an array directly, not an object with items
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  // Get a single product by ID
  const onGetProductById = async (id: string) => {
    const response = await getRequest({
      endPoint: `/api/products/${id}`,
    });
    return response;
  };

  // Create a new product
  const onCreateProduct = async (
    productData: any,
    files?: {
      mainImage?: File;
      additionalImages?: File[];
    }
  ) => {
    try {
      // Create FormData to handle both text fields and file uploads
      const formData = new FormData();

      // Add basic product data with proper field names to match the DTO
      formData.append("Name", productData.name);
      formData.append("Description", productData.description);
      formData.append("Price", productData.price.toString());
      formData.append("InStock", productData.inStock.toString());

      // Add category IDs
      if (productData.categoryIds && Array.isArray(productData.categoryIds)) {
        productData.categoryIds.forEach((categoryId: string) => {
          formData.append("CategoryIds", categoryId);
        });
      }

      // Add size IDs if available
      if (productData.sizeIds && Array.isArray(productData.sizeIds)) {
        productData.sizeIds.forEach((sizeId: string) => {
          formData.append("SizeIds", sizeId);
        });
      }

      // Add custom sizes if available
      if (productData.sizes && Array.isArray(productData.sizes)) {
        productData.sizes.forEach((size: any, index: number) => {
          formData.append(`Sizes[${index}].Size`, size.size);
          formData.append(`Sizes[${index}].Quantity`, size.quantity.toString());
        });
      }

      // Add images if provided
      if (files) {
        // Add main image
        if (files.mainImage) {
          formData.append("MainImage", files.mainImage);
        }

        // Add additional images
        if (files.additionalImages && files.additionalImages.length > 0) {
          files.additionalImages.forEach((file) => {
            formData.append("AdditionalImages", file);
          });
        }
      }

      // Send the request with formData
      const response = await postRequest({
        endPoint: "/api/products",
        formData: formData,
        isFormData: true,
      });

      return response;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  // Update an existing product
  const onUpdateProduct = async (
    id: string,
    data: any,
    isFormData: boolean = false
  ) => {
    try {
      const response = await putRequest({
        endPoint: `/api/products/${id}`,
        formData: data,
        isFormData,
      });
      return response;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  // Delete a product
  const onDeleteProduct = async (id: string) => {
    const response = await deleteRequest({
      endPoint: `/api/products/${id}`,
    });
    return response;
  };

  // Get photos for a product
  const onGetProductPhotos = async (productId: string) => {
    const response = await getRequest({
      endPoint: `/api/products/${productId}/photos`,
    });
    return response;
  };

  // Add a photo to a product
  const onAddProductPhoto = async (productId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await postRequest({
      endPoint: `/api/products/${productId}/photos`,
      formData,
      isFormData: true,
    });
    return response;
  };

  // Set a photo as the main photo
  const onSetMainProductPhoto = async (productId: string, photoId: string) => {
    const response = await putRequest({
      endPoint: `/api/products/${productId}/photos/${photoId}/set-main`,
      formData: {},
      isFormData: false,
    });
    return response;
  };

  // Delete a photo
  const onDeleteProductPhoto = async (productId: string, photoId: string) => {
    const response = await deleteRequest({
      endPoint: `/api/products/${productId}/photos/${photoId}`,
    });
    return response;
  };

  return {
    onGetProducts,
    onDeleteProductPhoto,
    onSetMainProductPhoto,
    onAddProductPhoto,
    onGetProductPhotos,
    onDeleteProduct,
    onUpdateProduct,
    onCreateProduct,
    onGetProductById,
  };
};

export const useCategory = () => {
  // Get all categories with pagination and filters
  const onGetCategories = async (params?: CategoryQueryParams) => {
    try {
      const apiParams = mapCategoryToApiParams(params);
      const queryString = new URLSearchParams(
        Object.entries(apiParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();

      const url = `/api/categories${queryString ? `?${queryString}` : ""}`;

      const response = await getRequest({ endPoint: url });
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  // Get a single category by ID
  const onGetCategoryById = async (id: string) => {
    try {
      const response = await getRequest({
        endPoint: `/api/categories/${id}`,
      });
      return response;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  };

  // Create a new category
  const onCreateCategory = async (categoryData: CreateCategoryDto) => {
    try {
      const response = await postRequest({
        endPoint: "/api/categories",
        formData: categoryData,
        isFormData: false,
      });
      return response;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  // Update an existing category
  const onUpdateCategory = async (
    id: string,
    categoryData: UpdateCategoryDto
  ) => {
    try {
      const response = await putRequest({
        endPoint: `/api/categories/${id}`,
        formData: categoryData,
        isFormData: false,
      });
      return response;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  // Delete a category
  const onDeleteCategory = async (id: string) => {
    try {
      const response = await deleteRequest({
        endPoint: `/api/categories/${id}`,
      });
      return response;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  return {
    onGetCategories,
    onGetCategoryById,
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
  };
};
