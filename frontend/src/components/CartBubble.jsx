import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

function CartBubble() {
  const { totalItems } = useCart();

  // If cart is empty, user can still see it (or return null to hide)
  if (totalItems === 0) return null; 

  const bubbleStyle = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    backgroundColor: "var(--primary-dark)",
    color: "white",
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 25px rgba(0, 47, 108, 0.4)",
    cursor: "pointer",
    zIndex: 1000,
    transition: "transform 0.2s",
  };

  const badgeStyle = {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "var(--accent-red)",
    color: "white",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "bold",
    border: "2px solid white"
  };

  return (
    <div 
        style={bubbleStyle} 
        className="hover-scale" // You can add a simple CSS class for hover later
        onClick={() => alert("Open Cart Summary!")} // Next Step: Open Drawer
    >
      <FiShoppingCart size={28} />
      
      {/* Badge Count */}
      {totalItems > 0 && (
        <div style={badgeStyle}>
            {totalItems}
        </div>
      )}
    </div>
  );
}

export default CartBubble;