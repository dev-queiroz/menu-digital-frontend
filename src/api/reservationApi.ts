import axiosInstance from "./axiosInstance";
import { Reservation } from "../types";

export const createReservation = async (
  date: string,
  time: string,
  numberOfPeople: number
): Promise<Reservation> => {
  const response = await axiosInstance.post("/reservations", {
    date,
    time,
    number_of_people: numberOfPeople,
  });
  return response.data.data;
};
