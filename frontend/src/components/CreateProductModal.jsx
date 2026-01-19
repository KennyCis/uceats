import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiUploadCloud, FiStar } from "react-icons/fi";
import axios from "axios";

function CreateProductModal({ onClose, onSaved, productToEdit = null }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  
  const [preview, setPreview] = useState(null);//selection
  const selectedFile = watch("image");//preview

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
        const file = selectedFile[0];
        setPreview(URL.createObjectURL(file));
    }
  }, [selectedFile]);

  //edit data 
  useEffect(() => {
    if (productToEdit) {
      setValue("name", productToEdit.name);
      setValue("price", productToEdit.price);
      setValue("stock", productToEdit.stock);
      setValue("category", productToEdit.category);
      setValue("isPopular", productToEdit.isPopular); // Load popular status
      setPreview(productToEdit.image);
    }
  }, [productToEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      //CREATE FORM DATA
      const formData = new FormData();
      
      //ADD CAMP THE TEXT
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("category", data.category);
      formData.append("isPopular", data.isPopular); // Send boolean

      //ADD IMAGE
      if (data.image && data.image[0]) {
          formData.append("image", data.image[0]);
      }

      //SEND POST or PUT
      if (productToEdit) {
        //Put send FormData
        await axios.put(`http://localhost:3000/api/products/${productToEdit._id}`, formData);
      } else {
        await axios.post("http://localhost:3000/api/products", formData);
      }
      
      onClose(); 
      if (onSaved) onSaved(); 

    } catch (error) {
      // Silent error handling
    }
  };

  //Styles
  const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(2px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
  const modalStyle = { backgroundColor: "var(--white)", padding: "30px", borderRadius: "20px", width: "450px", boxShadow: "var(--shadow-card)", position: "relative", animation: "fadeIn 0.3s ease", maxHeight: "90vh", overflowY: "auto" };
  const labelStyle = { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--primary-dark)" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #CBD5E0", fontSize: "14px", boxSizing: "border-box", backgroundColor: "#F8FAFC", marginBottom: "15px" };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2 style={{ margin: 0, color: "var(--primary-dark)", fontSize: "22px" }}>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} style={{ padding: "5px", cursor: "pointer", background: "none", border: "none" }}>
            <FiX size={24} color="var(--text-muted)" />
          </button>
        </div>

        {/*Form*/}
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
                <label style={labelStyle}>Daily Stock</label>
                <input 
                    type="number" 
                    {...register("stock", { required: true, min: 0 })} 
                    style={inputStyle} 
                    placeholder="Qty" 
                />
            </div>

            <div style={{ flex: 1 }}>
                <label style={labelStyle}>Category</label>
                <select {...register("category")} style={inputStyle}>
                    <option value="others">Others</option> {/* Added Others */}
                    <option value="food">Food</option>
                    <option value="drinks">Drinks</option>
                    <option value="snacks">Snacks</option> 
                </select>
            </div>
          </div>

          {/*imput image plus*/}
          <div style={{ marginBottom: "25px" }}>
             <label style={labelStyle}>Product Image</label>
             
             {/*click zone imput file*/}
             <div style={{ position: "relative" }}>
                 <input 
                    type="file" 
                    id="fileInput"
                    accept="image/*"
                    {...register("image")} 
                    style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 2 }} 
                 />
                 
                 <div style={{ 
                     border: "2px dashed #CBD5E0", borderRadius: "12px", padding: "20px", 
                     textAlign: "center", backgroundColor: "#F8FAFC", color: "var(--text-muted)",
                     display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                 }}>
                     {preview ? (
                        <img src={preview} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }} />
                     ) : (
                        <FiUploadCloud size={32} style={{ marginBottom: "10px", color: "var(--primary-blue)" }} />
                     )}
                     
                     <p style={{ margin: 0, fontSize: "13px" }}>
                        {preview ? "Click to change image" : "Click to upload image"}
                     </p>
                 </div>
             </div>
          </div>

          {/* CHECKBOX POPULAR (New Feature) */}
          <div style={{ 
            display: "flex", alignItems: "center", gap: "10px", 
            backgroundColor: "#FFFBEB", padding: "10px", borderRadius: "10px", 
            border: "1px solid #F6E05E", marginBottom: "20px" 
          }}>
            <input 
                type="checkbox" 
                id="isPopular" 
                {...register("isPopular")} 
                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#D69E2E" }} 
            />
            <label htmlFor="isPopular" style={{ margin: 0, fontWeight: "600", color: "#744210", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }}>
              <FiStar fill="#D69E2E" color="#D69E2E" /> Mark as Most Popular
            </label>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #CBD5E0", color: "var(--text-muted)", fontWeight: "600", background: "white", cursor: "pointer" }}>
                Cancel
            </button>
            <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "var(--primary-blue)", color: "white", fontWeight: "600", boxShadow: "0 4px 6px rgba(0, 78, 146, 0.2)", border: "none", cursor: "pointer" }}>
                {productToEdit ? "Update Changes" : "Save Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateProductModal;