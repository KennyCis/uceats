import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiShoppingBag, FiSettings, FiStar, FiCoffee, FiPackage } from "react-icons/fi"; 
import { BiFoodMenu } from "react-icons/bi";

function Sidebar() {
  const location = useLocation();

  const sidebarStyle = {
    width: "250px",
    height: "100vh",
    backgroundColor: "var(--white)", // Fondo Blanco
    position: "fixed",
    left: 0,
    top: 0,
    borderRight: "1px solid #E2E8F0",
    display: "flex",
    flexDirection: "column",
    padding: "30px 20px",
    zIndex: 50
  };

  // Función para estilos dinámicos (Activo vs Inactivo)
  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      display: "flex",
      alignItems: "center",
      padding: "12px 15px",
      marginBottom: "8px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s",
      // Si está activo: Fondo Azul Oscuro, Texto Blanco. Si no: Transparente, Texto Gris
      backgroundColor: isActive ? "var(--primary-dark)" : "transparent",
      color: isActive ? "var(--white)" : "var(--text-muted)",
      boxShadow: isActive ? "0 4px 12px rgba(0, 47, 108, 0.25)" : "none"
    };
  };

  const titleStyle = {
    fontSize: "11px", fontWeight: "700", color: "#CBD5E0", letterSpacing: "1.2px", marginBottom: "15px", marginTop: "25px", paddingLeft: "10px"
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo Texto */}
      <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--primary-dark)", marginBottom: "40px", paddingLeft: "10px" }}>
        UCEats<span style={{color: "var(--accent-red)"}}>.</span>
      </div>

      <div style={titleStyle}>MENU</div>
      <Link to="/orders" style={getLinkStyle("/orders")}>
        <FiShoppingBag style={{ marginRight: "12px", fontSize: "18px" }}/> Orders
      </Link>
      <Link to="/home" style={getLinkStyle("/home")}>
        <FiGrid style={{ marginRight: "12px", fontSize: "18px" }}/> Products
      </Link>
      
      <div style={titleStyle}>FILTERS</div>
      <Link to="/home?filter=popular" style={{...getLinkStyle("/popular"), color: "var(--primary-dark)"}}>
        <FiStar style={{ marginRight: "12px", color: "var(--accent-yellow)" }}/> Most Popular
      </Link>
      <Link to="/home?filter=snacks" style={getLinkStyle("/snacks")}>
        <FiPackage style={{ marginRight: "12px" }}/> Snacks
      </Link>
      <Link to="/home?filter=drinks" style={getLinkStyle("/drinks")}>
        <FiCoffee style={{ marginRight: "12px" }}/> Drinks
      </Link>

      <div style={{ marginTop: "auto" }}>
        <Link to="/manage" style={getLinkStyle("/manage")}>
          <FiSettings style={{ marginRight: "12px" }}/> Manage
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;