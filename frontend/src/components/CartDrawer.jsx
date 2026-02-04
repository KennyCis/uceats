import { useState } from "react";
import { FiX, FiTrash2, FiShoppingBag, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import axios from "axios"; 
import PaymentModal from "./PaymentModal"; 
import OrderSuccessModal from "./OrderSuccessModal"; 

function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const { user } = useAuth(); 
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    if (!user) {
        alert("Please login to continue.");
        return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
        const orderDataPayload = {
            userId: user.id, 
            cart: cart,
            total: total
        };

        // FIX: Add Authorization Header with Token
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        const res = await axios.post("http://3.227.144.60:3000/api/orders", orderDataPayload, config);
        
        const createdOrder = {
            _id: res.data._id || "NEW-" + Date.now(), 
            items: cart,
            total: total,
            date: new Date()
        };
        setLastOrderData(createdOrder);

        clearCart(); 
        setIsPaymentModalOpen(false);
        setIsSuccessOpen(true);  

    } catch (error) {
        console.error("Error creating order:", error);
    }
  };

  const handleCloseAll = () => {
      setIsSuccessOpen(false);
      onClose(); 
  };

  // --- STYLES ---
  const overlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 };
  const drawerStyle = { position: "fixed", top: 0, right: 0, bottom: 0, width: "400px", maxWidth: "85vw", backgroundColor: "white", zIndex: 2001, boxShadow: "-5px 0 15px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease-out" };
  const headerStyle = { padding: "20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const bodyStyle = { flex: 1, padding: "20px", overflowY: "auto" };
  const footerStyle = { padding: "20px", borderTop: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" };
  const itemStyle = { display: "flex", alignItems: "center", marginBottom: "15px", paddingBottom: "15px", borderBottom: "1px dashed #E2E8F0" };
  const checkoutBtnStyle = { width: "100%", padding: "15px", backgroundColor: "var(--primary-dark)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const qtyBtnStyle = { width: "28px", height: "28px", borderRadius: "8px", border: "none", backgroundColor: "#EDF2F7", color: "#2D3748", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px" };

  return (
    <>
      {!isPaymentModalOpen && !isSuccessOpen && (
        <>
            <div style={overlayStyle} onClick={onClose}></div>
            <div style={drawerStyle}>
                
                <div style={headerStyle}>
                <h2 style={{ margin: 0, fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <FiShoppingBag /> Your Order
                </h2>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <FiX size={24} />
                </button>
                </div>

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
                        <img src={item.image || "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"} style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "10px", border: "1px solid #EDF2F7" }} />
                        <div style={{ flex: 1, marginLeft: "15px" }}>
                            <h4 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>{item.name}</h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                                <button style={qtyBtnStyle} onClick={() => decreaseQuantity(item._id)}><FiMinus /></button>
                                <span style={{ fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                                <button style={qtyBtnStyle} onClick={() => increaseQuantity(item._id)}><FiPlus /></button>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                            <div style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>${(item.price * item.quantity).toFixed(2)}</div>
                            <button onClick={() => removeFromCart(item._id)} style={{ background: "none", color: "#C53030", border: "none", padding: "0", cursor: "pointer" }}><FiTrash2 size={16} /></button>
                        </div>
                    </div>
                    ))
                )}
                </div>

                {cart.length > 0 && (
                    <div style={footerStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button style={checkoutBtnStyle} onClick={handleCheckoutClick}>
                            <><span>Checkout</span><span>${total.toFixed(2)}</span></>
                        </button>
                    </div>
                )}
            </div>
        </>
      )}
      
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)} 
        total={total}
        onSuccess={handlePaymentSuccess}
      />

      <OrderSuccessModal 
        isOpen={isSuccessOpen}
        onClose={handleCloseAll} 
        orderData={lastOrderData}
      />

      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </>
  );
}

export default CartDrawer;