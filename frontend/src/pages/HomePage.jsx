import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import CreateProductModal from "../components/CreateProductModal";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  
  //edit
  const [editingProduct, setEditingProduct] = useState(null); 

  //search data
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
        alert("Product deleted successfully");
    } catch (error) {
        console.error("Error deleting:", error);
        alert("Could not delete product");
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />
      
      <div style={{ marginLeft: "250px" }}> 
        <Header />
        
        <main style={{ padding: "40px 80px" }}>
          
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ margin: 0, color: "var(--primary-dark)", fontSize: "28px" }}>Products Management</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>Manage your bar menu items</p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
            gap: "25px" 
          }}>
            
            {/* card ADD */}
            <div onClick={openCreateModal}>
               <ProductCard variant="add" />
            </div>

            {/*cards the products*/}
            {products.map(p => (
              <ProductCard 
                  key={p._id} 
                  product={p} 
                  isAdmin={true} 
                  onDelete={() => handleDelete(p._id)} 
                  onEdit={handleEdit} 
              />
            ))}

          </div>
        </main>
      </div>

      {/*modal conected*/}
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