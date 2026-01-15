import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import CreateProductModal from "../components/CreateProductModal";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get("category");
  const specialFilter = searchParams.get("filter");

  //search data
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      //silent
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // delete
  const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        fetchProducts(); 
        //no alert
    } catch (error) {
        console.error("Error deleting:", error);
        //silent error
    }
  };

  //preparing edit
  const handleEdit = (product) => {
    setEditingProduct(product); //save product
    setIsModalOpen(true);      
  };

  // clean
  const openCreateModal = () => {
    setEditingProduct(null); // clean info 
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
            
            {/* Card ADD - Only show if NO filter is active */}
            <div onClick={openCreateModal}>
               <ProductCard variant="add" />
            </div>

            {/* Render Filtered Products */}
            {filteredProducts.map(p => (
              <ProductCard 
                  key={p._id} 
                  product={p} 
                  isAdmin={true} 
                  onDelete={() => handleDelete(p._id)} 
                  onEdit={handleEdit} 
              />
            ))}

            {/* Empty State Message */}
            {filteredProducts.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#A0AEC0", marginTop: "50px" }}>
                    <h3>No products found in this category.</h3>
                    <p>Add a new one!</p>
                </div>
            )}

          </div>
        </main>
      </div>

      {/* Modal */}
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

    </div>
  );
}

export default HomePage;