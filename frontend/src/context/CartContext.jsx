import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  // Update total count whenever cart changes
  useEffect(() => {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalItems(count);
  }, [cart]);

  // Add Item Logic
  const addToCart = (product) => {
    setCart((prevCart) => {
      // 1. Check if product already exists
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // 2. If exists, just increase quantity
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 3. If new, add to array with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove Item Logic (for later)
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, totalItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};