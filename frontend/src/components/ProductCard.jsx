import { useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi"; 

function ProductCard({ variant = "default", product, isAdmin = false, onDelete, onEdit, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false); 

  // VARIANT: ADD NEW PRODUCT
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

  const handleCardClick = () => {
    if (isClient && !isOutOfStock) {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 150); 
        if (onAddToCart) onAddToCart(product);
    }
  };

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
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      position: "relative",
      minHeight: "280px",
      opacity: isOutOfStock ? 0.6 : 1,
      filter: isOutOfStock ? "grayscale(90%)" : "none",
      transition: "all 0.2s ease-in-out",
      cursor: (isClient && !isOutOfStock) ? "pointer" : "default",
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

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "8px", zIndex: 20 }}>
            {/* Botón Editar */}
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }} 
                style={{ border: "none", background: "#EDF2F7", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#2B6CB0" }}
            >
                <FiEdit size={16} />
            </button>
            
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(product._id); 
                }} 
                style={{ border: "none", background: "#FED7D7", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#C53030" }}
            >
                <FiTrash2 size={16} />
            </button>
        </div>
      )}

      <img src={product.image || "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"} alt={product.name} style={{ width: "120px", height: "120px", objectFit: "contain", marginBottom: "15px", marginTop: "15px" }} />

      <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", color: "#2D3748" }}>{product.name}</h3>
      <span style={{ fontSize: "14px", color: "#718096", textTransform: "capitalize", marginBottom: "10px", display: "block" }}>{product.category}</span>
      <span style={{ fontSize: "20px", fontWeight: "bold", color: "#003366" }}>${product.price.toFixed(2)}</span>

    </div>
  );
}

export default ProductCard;