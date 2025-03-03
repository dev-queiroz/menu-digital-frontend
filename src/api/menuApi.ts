import axiosInstance from "./axiosInstance";
import { MenuItem, MenuVariant } from "../types";

export const getMenuItems = async (): Promise<{
  items: MenuItem[];
  variants: MenuVariant[];
}> => {
  const response = await axiosInstance.get("/menu");
  return response.data.data; // { items: [], variants: [] }
};

export const getMenuItemById = async (id: number): Promise<MenuItem> => {
  const response = await axiosInstance.get(`/menu/${id}`);
  return response.data.data;
};
