import { FiX, FiMail, FiPhone, FiClock, FiHelpCircle } from "react-icons/fi";

function HelpModal({ onClose }) {
  
  // --- STYLES (Based on the reference image) ---
  const overlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)", // Darker semi-transparent background
    backdropFilter: "blur(3px)", // Slight blur effect
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000 // Very high priority to cover everything
  };

  const modalStyle = {
    backgroundColor: "white",
    padding: "40px 30px",
    borderRadius: "20px",
    width: "450px", // Fixed width like a card
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    position: "relative",
    textAlign: "center",
    animation: "fadeInUp 0.3s ease-out"
  };

  // Styles for the info boxes (Email, Phone, Hours)
  const infoBoxStyle = {
    border: "2px solid #E2E8F0",
    borderRadius: "12px",
    padding: "15px 20px",
    marginBottom: "15px",
    textAlign: "left",
    backgroundColor: "#F8FAFC"
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "var(--text-muted)",
    marginBottom: "5px",
    fontWeight: "600"
  };

  const textStyle = {
    margin: 0,
    fontSize: "16px",
    color: "var(--primary-dark)",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  const closeButtonStyle = {
    width: "100%",
    padding: "15px",
    backgroundColor: "var(--primary-dark)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background 0.2s"
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        {/* Top Icon */}
        <FiHelpCircle size={50} color="var(--primary-dark)" style={{ marginBottom: "15px" }} />

        <h2 style={{ margin: "0 0 10px 0", color: "var(--primary-dark)", fontSize: "24px" }}>
          Need Help?
        </h2>
        <p style={{ color: "var(--text-muted)", margin: "0 0 30px 0" }}>
          Contact the system creator
        </p>

        {/* INFO BOX 1: Email */}
        <div style={infoBoxStyle}>
            <span style={labelStyle}>Email</span>
            <p style={textStyle}>
                <FiMail color="var(--primary-blue)"/> support@uceats.com
            </p>
        </div>

        {/* INFO BOX 2: Phone */}
        <div style={infoBoxStyle}>
            <span style={labelStyle}>Phone</span>
            <p style={textStyle}>
                <FiPhone color="var(--primary-blue)"/> +593 99 123 4567
            </p>
        </div>

        {/* INFO BOX 3: Office Hours */}
        <div style={infoBoxStyle}>
            <span style={labelStyle}>Office Hours</span>
            <p style={textStyle}>
                <FiClock color="var(--primary-blue)"/> Monday - Friday: 8:00 AM - 6:00 PM
            </p>
        </div>

        {/* Close Button */}
        <button onClick={onClose} style={closeButtonStyle} className="hover-btn">
          Close
        </button>

      </div>
    </div>
  );
}

export default HelpModal;