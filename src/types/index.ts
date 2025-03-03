export interface User {
  id: string;
  email: string;
  role: "customer" | "staff" | "admin";
  name?: string;
  token: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string | null;
}

export interface MenuVariant {
  id: number;
  item_id: number;
  name: string;
  price: number;
  stock: number;
}

export interface Order {
  id: number;
  user_id: string;
  status: "pending" | "preparing" | "ready" | "delivered" | "canceled";
  total_amount: number;
  created_at: string;
  updated_at: string | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  order_id: number;
  stripe_payment_id: string;
  amount: number;
  status: "pending" | "succeeded" | "failed";
  created_at: string;
}

export interface Reservation {
  id: number;
  user_id: string;
  date: string;
  time: string;
  number_of_people: number;
  status: "pending" | "confirmed" | "canceled";
  created_at: string;
}

export interface CartItem {
  variant: MenuVariant;
  quantity: number;
}
