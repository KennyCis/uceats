import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import logo from "../assets/logo-uceats.png"; 
// 👇 1. IMPORTAR EL CONTEXTO (Vital para que cambie la foto)
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  // 👇 2. OBTENER DATOS DEL USUARIO
  const { user, logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);

  // Debug: Verificamos en consola si llegan los datos
  useEffect(() => {
    console.log("Datos en Header:", user);
  }, [user]);

  const headerStyle = {
    height: "80px",
    backgroundColor: "var(--white)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    position: "sticky",
    top: 0,
    zIndex: 40,
    boxShadow: "var(--shadow-soft)"
  };

  const dropdownStyle = {
    position: "absolute",
    top: "70px",
    right: "0",
    backgroundColor: "white",
    width: "200px",
    borderRadius: "12px",
    boxShadow: "var(--shadow-card)",
    padding: "8px",
    display: isOpen ? "block" : "none",
    border: "1px solid #f0f0f0"
  };

  const itemStyle = {
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "var(--text-main)",
    borderRadius: "8px",
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    background: "none",
    cursor: "pointer",
    textAlign: "left"
  };

  return (
    <header style={headerStyle}>
      {/* Lado Izquierdo: LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img src={logo} alt="Logo" style={{ height: "45px" }} />
        <div>
            <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>UCEats</h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Panel de Control</span>
        </div>
      </div>

      {/* Lado Derecho: PERFIL DINÁMICO */}
      <div style={{ position: "relative" }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 15px", borderRadius: "30px", backgroundColor: "#F7FAFC", border: "none", cursor: "pointer" }}
        >
          {/* FOTO DE PERFIL */}
          <div style={{ width: "35px", height: "35px", borderRadius: "50%", overflow: "hidden", backgroundColor: "var(--primary-dark)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            {/* Lógica: Si hay usuario y tiene imagen, mostramos la imagen. Si no, el icono. */}
            {user && user.image ? (
                <img 
                  src={user.image} 
                  alt="Profile" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e) => { e.target.style.display = 'none'; }} // Si falla la imagen, no la muestra rota
                />
            ) : (
                <FiUser /> // Icono por defecto
            )}
            
          </div>
          
          {/* NOMBRE DEL USUARIO (Aquí cambiamos "Admin" por el nombre real) */}
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>
            {user ? user.name : "Invitado"} 
          </span>
          
          <FiChevronDown />
        </button>

        {/* Menú Flotante */}
        <div style={dropdownStyle}>
            <button 
                onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                }}
                style={itemStyle} 
                className="hover-btn"
            >
                <FiUser style={{ marginRight: "10px" }} /> 
                Profile
            </button>
            
            <div style={{ height: "1px", backgroundColor: "#eee", margin: "5px 0" }}></div>
            
            <button 
                onClick={() => {
                    logout(); // Cierra sesión
                    navigate("/");
                }} 
                style={{ ...itemStyle, color: "var(--accent-red)" }}
            >
                <FiLogOut style={{ marginRight: "10px" }} /> Logout
            </button>
        </div>
      </div>
    </header>
  );
}

export default Header;