import { FiCheckCircle, FiX, FiPrinter } from "react-icons/fi";

function OrderSuccessModal({ isOpen, onClose, orderData }) {
  if (!isOpen || !orderData) return null;

  const overlayStyle = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000
  };

  const modalStyle = {
    backgroundColor: "white", padding: "30px", borderRadius: "20px",
    width: "400px", maxWidth: "90%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center", animation: "popIn 0.3s ease"
  };

  const ticketStyle = {
    backgroundColor: "#F7FAFC", padding: "20px", borderRadius: "10px",
    marginTop: "20px", border: "1px dashed #CBD5E0", textAlign: "left"
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        {/* ICON */}
        <div style={{ color: "#48BB78", marginBottom: "15px" }}>
            <FiCheckCircle size={60} />
        </div>

        <h2 style={{ margin: "0 0 10px 0", color: "#2D3748" }}>Payment Successful!</h2>
        <p style={{ color: "#718096", margin: 0 }}>Thank you for your purchase.</p>

        {/* TICKET */}
        <div style={ticketStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#A0AEC0", marginBottom: "10px" }}>
                <span>Order ID:</span>
                <span style={{ fontFamily: "monospace" }}>#{orderData._id?.slice(-6).toUpperCase()}</span>
            </div>
            
            <div style={{ borderBottom: "1px solid #E2E8F0", marginBottom: "10px", paddingBottom: "10px" }}>
                {orderData.items.map((item, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" }}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px", color: "#2D3748" }}>
                <span>Total Paid:</span>
                <span>${orderData.total.toFixed(2)}</span>
            </div>
        </div>

        {/* Close button */}
        <button 
            onClick={onClose}
            style={{ 
                marginTop: "25px", width: "100%", padding: "12px", 
                backgroundColor: "var(--primary-dark)", color: "white", 
                border: "none", borderRadius: "10px", fontWeight: "bold", 
                fontSize: "16px", cursor: "pointer" 
            }}
        >
            Close & Continue
        </button>

        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default OrderSuccessModal;