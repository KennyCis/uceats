import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; 
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton"; 
import CreateProductModal from "../components/CreateProductModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; 
import CartBubble from "../components/CartBubble"; 
import CartDrawer from "../components/CartDrawer";

// Initialize Socket connection
const socket = io("http://localhost:3000");

function HomePage() {
  const { addToCart } = useCart();
  const { user } = useAuth(); 

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [editingProduct, setEditingProduct] = useState(null); 

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get("category");
  const specialFilter = searchParams.get("filter");

  const isAdmin = user?.role === "admin";

  // Search/Fetch data
  const fetchProducts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      
      // Artificial delay to show skeleton effect (remove in production if desired)
      setTimeout(() => {
          setProducts(response.data);
          setLoading(false); // Stop loading skeleton
      }, 1000); 

    } catch (error) {
      console.error(error);
      setLoading(false); // Stop loading even on error
    }
  };

  useEffect(() => {
    fetchProducts();

    // Real-time Stock Update Listener
    socket.on("server:neworder", (newOrder) => {
        setProducts((currentProducts) => 
            currentProducts.map((product) => {
                const purchasedItem = newOrder.items.find(
                    (item) => item.product === product._id || item.product._id === product._id
                );

                if (purchasedItem) {
                    return { 
                        ...product, 
                        stock: Math.max(0, product.stock - purchasedItem.quantity) 
                    };
                }
                return product;
            })
        );
    });

    // Cleanup listener on unmount
    return () => {
        socket.off("server:neworder");
    };
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

  // FILTERING LOGIC
  const filteredProducts = products.filter(p => {
    if (specialFilter === "popular") {
        return p.isPopular === true;
    }
    if (categoryFilter) {
        return p.category === categoryFilter;
    }
    return true;
  });

  // Dynamic Title Helper
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
                {/* Adjust count based on loading state */}
                {loading ? "Updating..." : `${filteredProducts.length} items found`}
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
            gap: "25px" 
          }}>
            
            {/* Card ADD - Only show if user is ADMIN */}
            {isAdmin && !loading && (
                <div onClick={openCreateModal}>
                   <ProductCard variant="add" />
                </div>
            )}

            {/* 3. Conditional Rendering: Loading vs Data */}
            {loading ? (
                // Show 8 Skeletons while loading
                [...Array(8)].map((_, index) => (
                    <ProductSkeleton key={index} />
                ))
            ) : (
                // Show Real Products
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

            {/* Empty State Message */}
            {!loading && filteredProducts.length === 0 && (
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

      {/* Render Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

    </div>
  );
}

export default HomePage;