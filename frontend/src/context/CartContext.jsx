import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.warn("Cart storage blocked - cart won't persist across refreshes:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.warn("Cart storage blocked - changes won't persist:", error);
    }
  }, [cartItems]);

  const addToCart = (course) => {
    const existingItem = cartItems.find((item) => item._id === course._id);
    if (existingItem) {
      // Course already in cart
      return false;
    }
    setCartItems([...cartItems, course]);
    return true;
  };

  const removeFromCart = (courseId) => {
    setCartItems(cartItems.filter((item) => item._id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item?.price);
      return total + (Number.isFinite(price) ? price : 0);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
