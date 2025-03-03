import React, { createContext, useState, ReactNode } from "react";
import { CartItem, MenuVariant } from "../types";

export interface CartContextType {
  cart: CartItem[];
  addToCart: (variant: MenuVariant, quantity?: number) => void;
  removeFromCart: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  getTotal: () => number;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (variant: MenuVariant, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.variant.id === variant.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { variant, quantity }];
    });
  };

  const removeFromCart = (variantId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.variant.id !== variantId)
    );
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.variant.id === variantId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotal = (): number => {
    return cart.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
