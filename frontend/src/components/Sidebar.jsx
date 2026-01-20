import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiGrid, FiCoffee, FiPackage, FiStar, FiDisc, 
  FiHelpCircle, FiClipboard, FiShoppingBag 
} from "react-icons/fi"; 
import { MdOutlineFastfood } from "react-icons/md"; 
import HelpModal from "./HelpModal"; 
import { useAuth } from "../context/AuthContext";

const SidebarItem = ({ to, icon: Icon, label, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const style = {
      display: "flex",
      alignItems: "center",
      padding: "12px 15px",
      marginBottom: "8px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500", 
      textDecoration: "none",
      transition: "all 0.2s ease-in-out",
      cursor: "pointer",
      backgroundColor: isActive ? "var(--primary-dark)" : (isHovered ? "#F7FAFC" : "transparent"),
      color: isActive ? "var(--white)" : "var(--primary-dark)", 
      transform: isHovered && !isActive ? "translateX(5px)" : "none",
      boxShadow: isHovered && !isActive ? "0 2px 8px rgba(0,0,0,0.05)" : (isActive ? "0 4px 12px rgba(0, 47, 108, 0.25)" : "none")
    };
  
    if (to) {
        return (
            <Link 
                to={to} 
                style={style}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Icon style={{ marginRight: "12px", fontSize: "18px" }}/> {label}
            </Link>
        );
    }

    return (
        <div 
            onClick={onClick} 
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Icon style={{ marginRight: "12px", fontSize: "20px" }}/> {label}
        </div>
    );
};


function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const isActive = (path, queryParam = null) => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const filter = searchParams.get("filter");

    if (path === "/home" && !queryParam && !location.search) return true;
    if (path === "/orders") return location.pathname === "/orders"; 
    if (path === "/my-orders") return location.pathname === "/my-orders"; 

    if (queryParam) {
        if (queryParam.includes("category")) return category === queryParam.split("=")[1];
        if (queryParam.includes("filter")) return filter === queryParam.split("=")[1];
    }
    
    return location.pathname === path && !location.search;
  };

  const sidebarStyle = {
    width: "250px", height: "100vh", backgroundColor: "var(--white)",
    position: "fixed", left: 0, top: 0, borderRight: "1px solid #E2E8F0",
    display: "flex", flexDirection: "column", padding: "30px 20px",
    zIndex: 50, overflowY: "auto"
  };

  const titleStyle = {
    fontSize: "11px", fontWeight: "800", color: "#A0AEC0",
    letterSpacing: "1.2px", marginBottom: "15px", marginTop: "25px",
    paddingLeft: "10px", textTransform: "uppercase"
  };

  return (
    <>
      <aside style={sidebarStyle}>
        
        {/* USER ROLE DISPLAY */}
        <div style={{ marginBottom: "30px", paddingLeft: "10px" }}>
            <small style={{ color: "var(--primary-dark)", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>
                Current View
            </small>
            <h1 style={{ margin: "5px 0 0 0", color: "var(--primary-dark)", fontSize: "28px", textTransform: "uppercase", letterSpacing: "-1px" }}>
                {user ? user.role : "Guest"}
                <span style={{color: "var(--accent-red)", fontSize: "40px", lineHeight: "0px"}}>.</span>
            </h1>
        </div>

        <div style={titleStyle}>MENU</div>
        
        <SidebarItem to="/home" icon={FiGrid} label="All Products" isActive={isActive("/home")} />
        <SidebarItem to="/home?filter=popular" icon={FiStar} label="Most Popular" isActive={isActive("/home", "filter=popular")} />

        {/* 👇 MY ORDERS: HIDDEN FOR ADMIN */}
        {user?.role !== "admin" && (
            <SidebarItem 
                to="/my-orders" 
                icon={FiShoppingBag} 
                label="My Orders" 
                isActive={isActive("/my-orders")} 
            />
        )}

        {/* ADMIN ONLY */}
        {user?.role === "admin" && (
            <>
                <div style={titleStyle}>ADMINISTRATION</div>
                <SidebarItem to="/orders" icon={FiClipboard} label="Kitchen Orders" isActive={isActive("/orders")} />
            </>
        )}

        <div style={titleStyle}>CATEGORIES</div>

        <SidebarItem to="/home?category=food" icon={MdOutlineFastfood} label="Food" isActive={isActive("/home", "category=food")} />
        <SidebarItem to="/home?category=drinks" icon={FiCoffee} label="Drinks" isActive={isActive("/home", "category=drinks")} />
        <SidebarItem to="/home?category=snacks" icon={FiPackage} label="Snacks" isActive={isActive("/home", "category=snacks")} />
        <SidebarItem to="/home?category=others" icon={FiDisc} label="Others" isActive={isActive("/home", "category=others")} />

        <div style={{ marginTop: "20px", paddingTop: "10px", borderTop: "1px dashed #E2E8F0" }}>
            <SidebarItem onClick={() => setIsHelpOpen(true)} icon={FiHelpCircle} label="Help & Support" isActive={false} />
        </div>

      </aside>
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </>
  );
}

export default Sidebar;