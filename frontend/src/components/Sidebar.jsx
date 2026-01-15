import { Link, useLocation } from "react-router-dom";
import { 
  FiGrid,        //  All Products
  FiCoffee,      //  Drinks
  FiPackage,     //  Snacks
  FiStar,        //  Popular
  FiDisc,        //  Others
  FiSettings,    //  Manage
  FiLayers       //  Food (Usaremos Layers o Dinner)
} from "react-icons/fi"; 
import { MdOutlineFastfood } from "react-icons/md"; 

function Sidebar() {
  const location = useLocation();
  
  const isActive = (path, queryParam = null) => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const filter = searchParams.get("filter");

    if (path === "/home" && !queryParam && !location.search) return true;

    if (queryParam) {
        if (queryParam.includes("category")) return category === queryParam.split("=")[1];
        if (queryParam.includes("filter")) return filter === queryParam.split("=")[1];
    }
    
    return location.pathname === path && !location.search;
  };

  const sidebarStyle = {
    width: "250px",
    height: "100vh",
    backgroundColor: "var(--white)",
    position: "fixed",
    left: 0,
    top: 0,
    borderRight: "1px solid #E2E8F0",
    display: "flex",
    flexDirection: "column",
    padding: "30px 20px",
    zIndex: 50
  };

  const getLinkStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    marginBottom: "8px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    textDecoration: "none",
    backgroundColor: active ? "var(--primary-dark)" : "transparent",
    color: active ? "var(--white)" : "var(--text-muted)",
    boxShadow: active ? "0 4px 12px rgba(0, 47, 108, 0.25)" : "none",
    cursor: "pointer"
  });

  const titleStyle = {
    fontSize: "11px", fontWeight: "700", color: "#CBD5E0", letterSpacing: "1.2px", marginBottom: "15px", marginTop: "25px", paddingLeft: "10px"
  };

  return (
    <aside style={sidebarStyle}>
      {/* LOGO */}
      <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--primary-dark)", marginBottom: "30px", paddingLeft: "10px" }}>
        Admin<span style={{color: "var(--accent-red)"}}>.</span>
      </div>

      <div style={titleStyle}>MENU</div>
      
      {/* 1. All Products */}
      <Link to="/home" style={getLinkStyle(isActive("/home"))}>
        <FiGrid style={{ marginRight: "12px", fontSize: "18px" }}/> All Products
      </Link>

      {/* 2. Most Popular */}
      <Link to="/home?filter=popular" style={getLinkStyle(isActive("/home", "filter=popular"))}>
        <FiStar style={{ marginRight: "12px", fontSize: "18px", color: isActive("/home", "filter=popular") ? "white" : "gold" }}/> Most Popular
      </Link>

      <div style={titleStyle}>CATEGORIES</div>

      {/* 3. Food (NUEVO) */}
      <Link to="/home?category=food" style={getLinkStyle(isActive("/home", "category=food"))}>
        <MdOutlineFastfood style={{ marginRight: "12px" }}/> Food
      </Link>
      
      {/* 4. Drinks */}
      <Link to="/home?category=drinks" style={getLinkStyle(isActive("/home", "category=drinks"))}>
        <FiCoffee style={{ marginRight: "12px" }}/> Drinks
      </Link>
      
      {/* 5. Snacks */}
      <Link to="/home?category=snacks" style={getLinkStyle(isActive("/home", "category=snacks"))}>
        <FiPackage style={{ marginRight: "12px" }}/> Snacks
      </Link>

      {/* 6. Others (NUEVO) */}
      <Link to="/home?category=others" style={getLinkStyle(isActive("/home", "category=others"))}>
        <FiDisc style={{ marginRight: "12px" }}/> Others
      </Link>

      {/* 7. MANAGE */}
      <div style={{ marginTop: "20px", borderTop: "1px solid #EDF2F7", paddingTop: "20px" }}>
        {/* Este botón abrirá la carta desplegable en el futuro. 
            Por ahora lo dejamos visualmente listo. */}
        <div 
            style={{...getLinkStyle(false), color: "var(--primary-dark)", border: "1px dashed #CBD5E0", justifyContent: "center"}}
            onClick={() => alert("Aquí se abrirá la carta para editar categorías")}
        >
          <FiSettings style={{ marginRight: "12px" }}/> Manage Menu
        </div>
      </div>

      {/* ORDERS*/}
      <div style={{ marginTop: "auto" }}>
         {/* Dejamos el espacio reservado */}
      </div>
      
    </aside>
  );
}

export default Sidebar;