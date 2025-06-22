import { getRequest } from "@/lib/fetch";
import { GetOrderParams } from "@/lib/validations/order";

export type OrderQueryParams = {
  PageNumber?: number;
  PageSize?: number;
  ShippingType?: string;
  OrderState?: string;
  MinPrice?: number;
  MaxPrice?: number;
  OrderBy?: string;
  SortBy?: string;
};

export enum EOrderState {
  All = "All",
  Pending = "Pending",
  Packaged = "Packaged",
  InDelivery = "InDelivery",
  Undelivered = "Undelivered",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

const mapToApiParams = (params?: GetOrderParams): OrderQueryParams => {
  if (!params) return {};

  return {
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    ShippingType: params.shippingType,
    OrderState: params.orderState,
    MinPrice: params.minPrice,
    MaxPrice: params.maxPrice,
    OrderBy: params.sortBy,
    SortBy: params.sortBy,
  };
};

export const useOrders = () => {
  const onGetOrders = async (params: GetOrderParams) => {
    try {
      const apiParams = mapToApiParams(params);
      const queryString = new URLSearchParams(
        Object.entries(apiParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();

      const url = `/api/orders${queryString ? `?${queryString}` : ""}`;
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

  return {
    onGetOrders,
  };
};
