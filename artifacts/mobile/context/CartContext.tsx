import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Artwork } from "@/constants/sampleData";

interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (artwork: Artwork) => void;
  removeItem: (artworkId: string) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("@gana_cart").then((v) => {
      if (v) setItems(JSON.parse(v));
    });
  }, []);

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    AsyncStorage.setItem("@gana_cart", JSON.stringify(newItems));
  };

  const addItem = (artwork: Artwork) => {
    const existing = items.find((i) => i.artwork.id === artwork.id);
    if (existing) return;
    save([...items, { artwork, quantity: 1 }]);
  };

  const removeItem = (artworkId: string) => {
    save(items.filter((i) => i.artwork.id !== artworkId));
  };

  const clearCart = () => save([]);

  const totalAmount = items.reduce((sum, i) => sum + i.artwork.price * i.quantity, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalAmount, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
