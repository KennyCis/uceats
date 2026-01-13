import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

function ProductCard({ product, variant = "default" }) {
  
  
  if (variant === "add") {
    return (
      <div style={{
        border: "2px dashed #CBD5E0",
        borderRadius: "20px",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--primary-blue)",
        backgroundColor: "rgba(0, 78, 146, 0.03)"
      }}>
        <div style={{ backgroundColor: "#EBF8FF", padding: "15px", borderRadius: "50%", marginBottom: "15px" }}>
            <FiPlus style={{ fontSize: "30px" }} />
        </div>
        <span style={{ fontWeight: "600" }}>Add New Product</span>
      </div>
    );
  }


  return (
    <div style={{
      backgroundColor: "var(--white)",
      borderRadius: "20px",
      padding: "15px",
      boxShadow: "var(--shadow-soft)",
      position: "relative",
      minHeight: "260px",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* botons*/}
      <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "8px", zIndex: 10 }}>
        <button style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-blue)" }}>
            <FiEdit2 size={14} />
        </button>
        <button style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)" }}>
            <FiTrash2 size={14} />
        </button>
      </div>

      {/* Imagen*/}
      <div style={{ width: "100%", height: "140px", borderRadius: "15px", overflow: "hidden", marginBottom: "15px" }}>
        <img 
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60" 
            alt="Product" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>

      {/* Info */}
      <div style={{ marginTop: "auto" }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", color: "var(--primary-dark)" }}>{product.name}</h3>
        <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--accent-red)" }}>
            ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;