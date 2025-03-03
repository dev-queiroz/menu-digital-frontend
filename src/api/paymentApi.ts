import axiosInstance from "./axiosInstance";

export const initiatePayment = async (
  orderId: number,
  amount: number
): Promise<string> => {
  const response = await axiosInstance.post("/payments/initiate", {
    orderId,
    amount,
  });
  return response.data.data.clientSecret;
};

export const confirmPayment = async (
  paymentIntentId: string
): Promise<void> => {
  await axiosInstance.post("/payments/confirm", { paymentIntentId });
};
