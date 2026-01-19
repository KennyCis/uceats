import { useState } from "react";
import { FiX, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import axios from "axios"; 

function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);

  // Calculate Total Price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  // --- HANDLE CHECKOUT ---
  const handleCheckout = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
        // 1. Prepare Payload
        const orderData = {
            userId: user.id, // Ensure user object has 'id'
            cart: cart,
            total: total
        };

        // 2. Send to Backend
        await axios.post("http://localhost:3000/api/orders", orderData);
        
        // Succes
        clearCart(); 
        onClose();   

    } catch (error) {
        // sillent catch
    } finally {
        setLoading(false);
    }
  };

  // --- STYLES ---
  const overlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000,
    backdropFilter: "blur(2px)"
  };

  const drawerStyle = {
    position: "fixed", top: 0, right: 0, bottom: 0,
    width: "400px", backgroundColor: "white", zIndex: 2001,
    boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
    display: "flex", flexDirection: "column",
    animation: "slideIn 0.3s ease-out"
  };

  const headerStyle = {
    padding: "20px", borderBottom: "1px solid #E2E8F0",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  };

  const bodyStyle = {
    flex: 1, padding: "20px", overflowY: "auto"
  };

  const footerStyle = {
    padding: "20px", borderTop: "1px solid #E2E8F0", backgroundColor: "#F8FAFC"
  };

  const itemStyle = {
    display: "flex", alignItems: "center", marginBottom: "15px",
    paddingBottom: "15px", borderBottom: "1px dashed #E2E8F0"
  };

  const checkoutBtnStyle = {
    width: "100%", padding: "15px", 
    backgroundColor: loading ? "#A0AEC0" : "var(--primary-dark)", 
    color: "white", border: "none", borderRadius: "12px",
    fontSize: "16px", fontWeight: "bold", 
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose}></div>
      
      <div style={drawerStyle}>
        
        {/* HEADER */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <FiShoppingBag /> Your Order
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FiX size={24} />
          </button>
        </div>

        {/* BODY (List of Items) */}
        <div style={bodyStyle}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "50px", color: "#A0AEC0" }}>
              <FiShoppingBag size={50} style={{ opacity: 0.2 }} />
              <p>Your cart is empty.</p>
              <small>Add some delicious food!</small>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} style={itemStyle}>
                {/* Image */}
                <img 
                    src={item.image || "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"} 
                    style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "10px", border: "1px solid #EDF2F7" }}
                />
                
                {/* Details */}
                <div style={{ flex: 1, marginLeft: "15px" }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>{item.name}</h4>
                    <div style={{ fontSize: "12px", color: "#718096" }}>
                        ${item.price.toFixed(2)} x {item.quantity}
                    </div>
                    <div style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>

                {/* Remove Button */}
                <button 
                    onClick={() => removeFromCart(item._id)}
                    style={{ background: "#FFF5F5", color: "#C53030", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                >
                    <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER (Total & Checkout) */}
        {cart.length > 0 && (
            <div style={footerStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                
                <button 
                    style={checkoutBtnStyle}
                    onClick={handleCheckout} 
                    disabled={loading} 
                >
                    {loading ? (
                        <span>Processing...</span>
                    ) : (
                        <>
                            <span>Checkout</span>
                            <span>${total.toFixed(2)}</span>
                        </>
                    )}
                </button>
            </div>
        )}

      </div>
      
      <style>{`
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

export default CartDrawer;