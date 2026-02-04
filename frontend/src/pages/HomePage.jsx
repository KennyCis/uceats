import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";
import io from "socket.io-client"; 

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton"; 
import CreateProductModal from "../components/CreateProductModal";
import AdminDashboard from "./AdminDashboard"; 

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; 
import CartBubble from "../components/CartBubble"; 
import CartDrawer from "../components/CartDrawer";

// Initialize Socket connection
const socket = io("http://3.227.144.60:3000");

function HomePage() {
  const { addToCart } = useCart();
  const { user } = useAuth(); // Token access
  const navigate = useNavigate();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [editingProduct, setEditingProduct] = useState(null); 

  // URL Params Logic
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const categoryFilter = searchParams.get("category");
  const specialFilter = searchParams.get("filter");
  const viewFilter = searchParams.get("view"); 

  const isAdmin = user?.role === "admin";
  const showDashboard = isAdmin && viewFilter === "overview";

  // Search/Fetch data
  const fetchProducts = async () => {
    setLoading(true); 
    try {
      const response = await axios.get("http://3.227.144.60:3000/api/products");
      
      setTimeout(() => {
          setProducts(response.data);
          setLoading(false); 
      }, 1000); 

    } catch (error) {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProducts();

    socket.on("server:neworder", (newOrder) => {});

    socket.on("server:newproduct", (newProduct) => {
      setProducts((prev) => [...prev, newProduct]);
    });

    socket.on("server:deleteproduct", (deletedId) => {
      setProducts((prev) => prev.filter(p => p._id !== deletedId));
    });

    socket.on("server:updateproduct", (updatedProduct) => {
      setProducts((prev) => prev.map(p =>
        p._id === updatedProduct._id ? updatedProduct : p
      ));
    });

    return () => {
      socket.off("server:neworder");
      socket.off("server:newproduct");
      socket.off("server:deleteproduct");
      socket.off("server:updateproduct");
    };
  }, []);

  // --- DELETE PRODUCT (SECURE & SILENT) ---
  const handleDelete = async (id) => {
    if (!user?.token) return; // Silent fail if no token

    try {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`http://3.227.144.60:3000/api/products/${id}`, config);
        // Socket updates the UI automatically
    } catch (error) {
       console.error("Error deleting product:", error);
    }
  };

  // Prepare Edit
  const handleEdit = (product) => {
    setEditingProduct(product); 
    setIsModalOpen(true);      
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null); 
    setIsModalOpen(true);
  };

  // FILTERING LOGIC
  const filteredProducts = products.filter(p => {
    if (specialFilter === "popular") return p.isPopular === true;
    if (categoryFilter) return p.category === categoryFilter;
    return true;
  });

  const getPageTitle = () => {
    if (specialFilter === "popular") return "Most Popular ⭐";
    if (categoryFilter) return categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
    return "All Products";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />
      
      <div className="dashboard-content">
        <Header />

        <main className="main-container">

          {!showDashboard && (
            <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ margin: 0, color: "var(--primary-dark)", fontSize: "28px" }}>
                    {getPageTitle()}
                    </h1>
                    
                    <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>
                    {loading ? "Updating..." : `${filteredProducts.length} items found`}
                    </p>
                </div>
            </div>
          )}

          {showDashboard ? (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
                <AdminDashboard />
            </div>
          ) : (
            <div className="products-grid">

                {/* Card ADD */}
                {isAdmin && !loading && (
                <div onClick={openCreateModal}>
                    <ProductCard variant="add" />
                </div>
                )}

                {/* Products */}
                {loading ? (
                [...Array(6)].map((_, index) => (
                    <ProductSkeleton key={index} />
                ))
                ) : (
                filteredProducts.map(p => (
                    <ProductCard
                    key={p._id}
                    product={p}
                    isAdmin={isAdmin}
                    onDelete={() => handleDelete(p._id)} 
                    onEdit={handleEdit}
                    onAddToCart={() => addToCart(p)}
                    />
                ))
                )}

                {/* Empty State */}
                {!loading && filteredProducts.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#A0AEC0", marginTop: "50px" }}>
                        <h3>No products found in this category.</h3>
                        {isAdmin && <p>Add a new one!</p>}
                    </div>
                )}
            </div>
          )}

        </main>
      </div>

      {isModalOpen && (
        <CreateProductModal 
          onClose={() => setIsModalOpen(false)} 
          productToEdit={editingProduct} 
          onSaved={() => {
             setIsModalOpen(false);
             fetchProducts();
          }}
        />
      )}

      {!isAdmin && ( 
        <div onClick={() => setIsCartOpen(true)}>
             <CartBubble />
        </div>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

    </div>
  );
}

export default HomePage;