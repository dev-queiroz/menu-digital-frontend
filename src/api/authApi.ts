import axiosInstance from "./axiosInstance";
import { User } from "../types";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await axiosInstance.post("/users/login", {
    email,
    password,
  });
  return response.data.data.token;
};

export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await axiosInstance.post("/users/register", {
    email,
    password,
  });
  return response.data.data;
};
