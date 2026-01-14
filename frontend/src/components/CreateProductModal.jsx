import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiUploadCloud } from "react-icons/fi";
import axios from "axios";

// 2. We accept a new prop: 'productToEdit'
function CreateProductModal({ onClose, onSaved, productToEdit = null }) {
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // 3. EFFECT: If we are editing, pre-fill the form fields
  useEffect(() => {
    if (productToEdit) {
      setValue("name", productToEdit.name);
      setValue("price", productToEdit.price);
      setValue("category", productToEdit.category);
      // We ignore image for now as it is complex to pre-fill file inputs
    }
  }, [productToEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      const productData = {
        name: data.name,
        price: parseFloat(data.price),
        category: data.category
      };

      if (productToEdit) {
        // --- EDIT MODE (PUT) ---
        await axios.put(`http://localhost:3000/api/products/${productToEdit._id}`, productData);
        alert("Product updated successfully! 🔄");
      } else {
        // --- CREATE MODE (POST) ---
        await axios.post("http://localhost:3000/api/products", productData);
        alert("Product created successfully! 🎉");
      }
      
      onClose(); 
      if (onSaved) onSaved(); 

    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Check console.");
    }
  };

  // --- STYLES (Same as before) ---
  const overlayStyle = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(2px)", 
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 
  };

  const modalStyle = {
    backgroundColor: "var(--white)", padding: "30px", borderRadius: "20px",
    width: "450px", boxShadow: "var(--shadow-card)", position: "relative", animation: "fadeIn 0.3s ease" 
  };
  const labelStyle = { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--primary-dark)" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #CBD5E0", fontSize: "14px", boxSizing: "border-box", backgroundColor: "#F8FAFC", marginBottom: "15px" };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          {/* Dynamic Title */}
          <h2 style={{ margin: 0, color: "var(--primary-dark)", fontSize: "22px" }}>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} style={{ padding: "5px", cursor: "pointer" }}>
            <FiX size={24} color="var(--text-muted)" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div>
            <label style={labelStyle}>Product Name</label>
            <input {...register("name", { required: true })} style={inputStyle} placeholder="Ex: Monster Burger" />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Price ($)</label>
                <input type="number" step="0.01" {...register("price", { required: true })} style={inputStyle} placeholder="0.00" />
            </div>
            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Category</label>
                <select {...register("category")} style={inputStyle}>
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                    <option value="snack">Snack</option>
                </select>
            </div>
          </div>

          <div style={{ marginBottom: "25px" }}>
             <label style={labelStyle}>Product Image</label>
             <div style={{ border: "2px dashed #CBD5E0", borderRadius: "12px", padding: "30px", textAlign: "center", cursor: "pointer", backgroundColor: "#F8FAFC", color: "var(--text-muted)" }}>
                 <FiUploadCloud size={32} style={{ marginBottom: "10px", color: "var(--primary-blue)" }} />
                 <p style={{ margin: 0, fontSize: "13px" }}>Image upload coming soon...</p>
                 <input type="file" {...register("image")} style={{ display: "none" }} />
             </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #CBD5E0", color: "var(--text-muted)", fontWeight: "600" }}>
                Cancel
            </button>
            <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "var(--primary-blue)", color: "white", fontWeight: "600", boxShadow: "0 4px 6px rgba(0, 78, 146, 0.2)" }}>
                {productToEdit ? "Update Changes" : "Save Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateProductModal;