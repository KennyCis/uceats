import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FiPlus } from "react-icons/fi"; // Only for the "Add New" card

function ProductCard({ variant = "default", product, isAdmin = false, onDelete, onEdit, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // For visual click feedback

  //VARIANT: ADD NEW PRODUCT (Static, for Admin) 
  if (variant === "add") {
    return (
      <div style={{
        height: "100%", minHeight: "280px", border: "2px dashed #CBD5E0", borderRadius: "20px",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        cursor: "pointer", color: "#718096", backgroundColor: "#F7FAFC"
      }}>
        <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#E2E8F0", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
          <FiPlus size={24} />
        </div>
        <span style={{ fontWeight: "600" }}>Add New Product</span>
      </div>
    );
  }

  // --- LOGIC ---
  const stock = product.stock || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isClient = !isAdmin;

  // Handle Card Click (Only for Client & In Stock)
  const handleCardClick = () => {
    if (isClient && !isOutOfStock) {
        // Visual effect
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 150); // Reset after 150ms
        
        // Add to cart action
        if (onAddToCart) onAddToCart(product);
    }
  };

  // Dynamic Styles
  const getBadgeStyle = () => {
      if (isOutOfStock) return { bg: "#FED7D7", color: "#C53030", text: "Sold Out" };
      if (isLowStock) return { bg: "#FEEBC8", color: "#C05621", text: `Low: ${stock}` };
      return { bg: "#C6F6D5", color: "#2F855A", text: `Stock: ${stock}` };
  };
  const badge = getBadgeStyle();

  const cardStyle = {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      position: "relative",
      minHeight: "280px",
      opacity: isOutOfStock ? 0.6 : 1,
      filter: isOutOfStock ? "grayscale(90%)" : "none",
      transition: "all 0.2s ease-in-out",
      
      // INTERACTION STYLES:
      cursor: (isClient && !isOutOfStock) ? "pointer" : "default",
      // If Client Hover -> Blue Border. If Clicked -> Scale down slightly
      border: (isClient && isHovered && !isOutOfStock) ? "2px solid var(--primary-blue)" : "2px solid transparent",
      transform: isClicked ? "scale(0.95)" : (isHovered && isClient && !isOutOfStock ? "translateY(-5px)" : "none"),
      boxShadow: (isClient && isHovered && !isOutOfStock) ? "0 15px 30px rgba(0,0,0,0.1)" : "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
  };

  return (
    <div 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
    >
      
      {/* STOCK BADGE */}
      <div style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: badge.bg, color: badge.color, padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", zIndex: 10 }}>
          {badge.text}
      </div>

      {/* ADMIN ACTIONS (Stop Propagation to prevent adding to cart) */}
      {isAdmin && (
        <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "8px", zIndex: 20 }}>
            <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} style={{ border: "none", background: "#EDF2F7", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#2B6CB0" }}>
                <FiEdit size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if(window.confirm("Delete?")) onDelete(product._id); }} style={{ border: "none", background: "#FED7D7", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#C53030" }}>
                <FiTrash2 size={16} />
            </button>
        </div>
      )}

      {/* PRODUCT IMAGE */}
      <img src={product.image || "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"} alt={product.name} style={{ width: "120px", height: "120px", objectFit: "contain", marginBottom: "15px", marginTop: "15px" }} />

      {/* INFO */}
      <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", color: "#2D3748" }}>{product.name}</h3>
      <span style={{ fontSize: "14px", color: "#718096", textTransform: "capitalize", marginBottom: "10px", display: "block" }}>{product.category}</span>
      <span style={{ fontSize: "20px", fontWeight: "bold", color: "#003366" }}>${product.price.toFixed(2)}</span>

    </div>
  );
}

export default ProductCard;