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

  // Add Item Logic (Standard add)
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // --- NEW: INCREASE QUANTITY (+) ---
  const increaseQuantity = (productId) => {
    setCart((prevCart) => 
        prevCart.map((item) => 
            item._id === productId 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
        )
    );
  };

  // --- NEW: DECREASE QUANTITY (-) ---
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
        const item = prevCart.find((i) => i._id === productId);
        
        // If quantity is 1, remove item
        if (item?.quantity === 1) {
            return prevCart.filter((i) => i._id !== productId);
        }

        // Otherwise, decrease by 1
        return prevCart.map((i) => 
            i._id === productId 
                ? { ...i, quantity: i.quantity - 1 } 
                : i
        );
    });
  };

  // Remove Item Logic (Trash button)
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
        cart, 
        totalItems, 
        addToCart, 
        increaseQuantity, // Exported
        decreaseQuantity, // Exported
        removeFromCart, 
        clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};