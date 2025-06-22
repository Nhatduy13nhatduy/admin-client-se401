import { z } from "zod";

export const orderProduct = z.object({
  productSizeId: z.string().uuid(),
  productName: z.string(),
  productPrice: z.number(),
  quantity: z.number(),
  productPhotoUrl: z.string(),
  size: z.string(),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  ownerAvatar: z.string(),
  ownerName: z.string(),
  ownerEmail: z.string(),
  totalPrice: z.number(),
  shippingType: z.string(),
  shippingCost: z.number(),
  orderState: z.string(),
  createdAt: z.string().datetime(), // ISO 8601 format
  products: z.array(orderProduct),
});

export const getOrderSchema = z.object({
  shippingType: z.string().optional(),
  orderState: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  orderBy: z.string().optional(),
  sortBy: z.string().optional(),
  pageNumber: z.coerce.number().int().optional(),
  pageSize: z.coerce.number().int().optional(),
});

export type OrderProduct = z.infer<typeof orderProduct>;
export type Order = z.infer<typeof orderSchema>;
export type GetOrderParams = z.infer<typeof getOrderSchema>;
