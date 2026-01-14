import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

// We added 'onDelete' and 'onEdit' props
function ProductCard({ variant = "default", product, isAdmin = false, onDelete, onEdit }) {
  
  //VARIANT: ADD NEW PRODUCT
  if (variant === "add") {
    return (
      <div style={{
        height: "100%",
        minHeight: "280px",
        border: "2px dashed #CBD5E0",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        color: "#718096",
        backgroundColor: "#F7FAFC",
        transition: "all 0.2s"
      }}>
        <div style={{
          width: "50px", height: "50px", borderRadius: "50%",
          backgroundColor: "#E2E8F0", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px"
        }}>
          <FiPlus size={24} />
        </div>
        <span style={{ fontWeight: "600" }}>Add New Product</span>
      </div>
    );
  }

  // --- VARIANT: PRODUCT CARD ---
  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      position: "relative", // Needed for positioning buttons
      transition: "transform 0.2s",
      minHeight: "280px"
    }}>
      
      {/* ADMIN ACTIONS (Edit & Delete) */}
      {isAdmin && (
        <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "8px" }}>
            {/* Edit Button (Visual only for now) */}
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }} 
                style={{ border: "none", background: "#EDF2F7", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#2B6CB0" }}
            >
                <FiEdit size={16} />
            </button>
            
            {/* Delete Button */}
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); // Prevents clicking the card background
                    if(window.confirm("Are you sure you want to delete this product?")) {
                        onDelete(product._id); 
                    }
                }} 
                style={{ border: "none", background: "#FED7D7", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#C53030" }}
            >
                <FiTrash2 size={16} />
            </button>
        </div>
      )}

      {/* Image */}
      <img 
        src={product.image || "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"} 
        alt={product.name} 
        style={{ width: "120px", height: "120px", objectFit: "contain", marginBottom: "15px" }} 
      />

      {/* Info */}
      <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", color: "#2D3748" }}>{product.name}</h3>
      <span style={{ fontSize: "14px", color: "#718096", textTransform: "capitalize", marginBottom: "10px", display: "block" }}>
        {product.category}
      </span>
      <span style={{ fontSize: "20px", fontWeight: "bold", color: "#003366" }}>
        ${product.price.toFixed(2)}
      </span>

    </div>
  );
}

export default ProductCard;