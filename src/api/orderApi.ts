import axiosInstance from "./axiosInstance";
import { Order } from "../types";

interface OrderItemInput {
  variant_id: number;
  quantity: number;
}

export const createOrder = async (items: OrderItemInput[]): Promise<Order> => {
  const response = await axiosInstance.post("/orders", { items });
  return response.data.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: Order["status"]
): Promise<Order> => {
  const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
    status,
  });
  return response.data.data;
};
