import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import CreateProductModal from "../components/CreateProductModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // 1. Import Hook
import CartBubble from "../components/CartBubble"; // 2. Import Bubble
import CartDrawer from "../components/CartDrawer";

function HomePage() {
  // Get 'addToCart' directly from Context
  const { addToCart } = useCart();
  const { user } = useAuth(); 

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get("category");
  const specialFilter = searchParams.get("filter");

  // Determine if user is Admin
  const isAdmin = user?.role === "admin";

  // Search/Fetch data
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      // silent error
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        fetchProducts(); 
    } catch (error) {
        // silent error
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

  // 2. FILTERING LOGIC
  const filteredProducts = products.filter(p => {
    // A. Filter by Popularity
    if (specialFilter === "popular") {
        return p.isPopular === true;
    }
    // B. Filter by Category
    if (categoryFilter) {
        return p.category === categoryFilter;
    }
    // C. Default: Show All
    return true;
  });

  // 3. Dynamic Title Helper
  const getPageTitle = () => {
    if (specialFilter === "popular") return "Most Popular ⭐";
    if (categoryFilter) return categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
    return "All Products";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />
      
      <div style={{ marginLeft: "250px" }}> 
        <Header />
        
        <main style={{ padding: "40px 80px" }}>
          
          {/* Dynamic Header */}
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ margin: 0, color: "var(--primary-dark)", fontSize: "28px" }}>
                {getPageTitle()}
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>
                {filteredProducts.length} items found
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
            gap: "25px" 
          }}>
            
            {/* Card ADD - Only show if user is ADMIN */}
            {isAdmin && (
                <div onClick={openCreateModal}>
                   <ProductCard variant="add" />
                </div>
            )}

            {/* Render Filtered Products */}
            {filteredProducts.map(p => (
              <ProductCard 
                  key={p._id} 
                  product={p} 
                  isAdmin={isAdmin} 
                  onDelete={() => handleDelete(p._id)} 
                  onEdit={handleEdit} 
                  // HERE IS THE CHANGE: Use context function
                  onAddToCart={() => addToCart(p)}
              />
            ))}

            {/* Empty State Message */}
            {filteredProducts.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#A0AEC0", marginTop: "50px" }}>
                    <h3>No products found in this category.</h3>
                    {isAdmin && <p>Add a new one!</p>}
                </div>
            )}

          </div>
        </main>
      </div>

      {/* Modal - Only Admins can trigger this via the Add Card */}
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

      {!isAdmin && ( // open drawer
        <div onClick={() => setIsCartOpen(true)}>
             <CartBubble />
        </div>
      )}

      {/* Rende Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

    </div>
  );
}

export default HomePage;