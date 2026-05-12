import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, quantity }];
    });
    toast.success("Added to cart");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
