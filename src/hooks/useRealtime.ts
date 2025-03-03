import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Order } from "../types";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
);

export const useRealtime = (
  channelName: string,
  eventName: string,
  callback: (payload: any) => void
) => {
  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: eventName }, (payload) => {
        callback(payload.payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, eventName, callback]);
};

export const useOrderUpdates = (
  userId: string,
  onUpdate: (order: Order) => void
) => {
  useRealtime(`customer_${userId}`, "order_update", (payload) => {
    const order: Order = {
      id: payload.order_id,
      user_id: userId,
      status: payload.status,
      total_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onUpdate(order);
  });
};
