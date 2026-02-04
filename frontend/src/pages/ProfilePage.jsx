import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiCheck } from "react-icons/fi"; 
import { useForm } from "react-hook-form";
import axios from "axios";
import logo from "../assets/logo-uceats.png";
import { useAuth } from "../context/AuthContext";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function ProfilePage() {
  const { user, updateUser } = useAuth(); 
  const [activeTab, setActiveTab] = useState("profile");
  const [imagePreview, setImagePreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState(""); 

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      if (user.birthdate) {
        setValue("birthdate", user.birthdate.split('T')[0]);
      }
      setImagePreview(user.image);
    }
  }, [user, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", e.target.files);
    }
  };

  const onSubmit = async (data) => {
    setSuccessMsg(""); 
    try {
      const formData = new FormData();
      
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("birthdate", data.birthdate);
      
      if (data.password) {
        formData.append("password", data.password);
      }

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${user.token}` 
        }
      };

      const res = await axios.put(
        `http://3.227.144.60:3000/api/profile/${user.id}`, 
        formData, 
        config 
      );
      
      updateUser(res.data);
      
      setSuccessMsg("Changes saved successfully!");
      
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // --- STYLES ---
  const containerStyle = { minHeight: "100vh", backgroundColor: "#F8FAFC" };
  const topNavStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", backgroundColor: "white", borderBottom: "1px solid #E2E8F0" };
  const backLinkStyle = { display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--primary-dark)", fontWeight: "600" };
  
  const mainContentStyle = { 
    maxWidth: "1100px", 
    margin: "40px auto", 
    display: "flex", 
    flexWrap: "wrap", 
    gap: "30px", 
    padding: "0 20px" 
  };

  const leftCardStyle = { flex: "1 1 300px", backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "var(--shadow-card)", height: "fit-content", textAlign: "center" };
  const rightSectionStyle = { flex: "2 1 400px", backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "var(--shadow-card)" };
  
  const tabsContainerStyle = { display: "flex", gap: "10px", borderBottom: "2px solid #E2E8F0", marginBottom: "30px", flexWrap: "wrap" };
  const tabStyle = (isActive) => ({ padding: "15px 25px", cursor: "pointer", fontWeight: "600", color: isActive ? "var(--primary-dark)" : "#718096", borderBottom: isActive ? "3px solid var(--primary-blue)" : "3px solid transparent", marginBottom: "-2px", whiteSpace: "nowrap" });
  
  const formSectionTitleStyle = { color: "var(--primary-dark)", marginBottom: "25px", fontSize: "24px" };
  const inputGroupStyle = { marginBottom: "20px" };
  const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--primary-dark)" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #CBD5E0", backgroundColor: "#F8FAFC", fontSize: "14px", boxSizing: "border-box" };
  const saveButtonStyle = { backgroundColor: "var(--primary-dark)", color: "white", border: "none", padding: "12px 30px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", marginTop: "10px", width: "100%" };
  
  const successStyle = { backgroundColor: "#DEF7EC", color: "#03543F", padding: "10px", borderRadius: "8px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={topNavStyle}>
        <Link to="/home" style={backLinkStyle}>
          <FiArrowLeft size={20} />
          <span className="desktop-only">Back to Home</span>
        </Link>
        <img src={logo} alt="UCEats Logo" style={{ height: "50px", objectFit: "contain" }} />
        <div style={{width: 20}}></div> 
      </div>

      <div style={mainContentStyle}>
        <div style={leftCardStyle}>
            <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 20px" }}>
                <img 
                    src={imagePreview || DEFAULT_AVATAR} 
                    alt="Profile" 
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }} 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #EDF2F7", backgroundColor: "#fff" }} 
                />
                <label style={{ position: "absolute", bottom: "0", right: "0", backgroundColor: "var(--primary-blue)", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
                    <FiCamera size={16} />
                    <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
                </label>
            </div>
            <h2 style={{margin: "0 0 5px 0", color: "var(--primary-dark)"}}>{user.name}</h2>
            <p style={{margin: "0 0 20px 0", color: "#718096"}}>{user.email}</p>
            <div style={{borderTop: "1px solid #E2E8F0", paddingTop: "20px", textAlign: "left"}}>
                <small style={{color: "#718096"}}>Role</small>
                <p style={{margin: "5px 0 0 0", fontWeight: "600", color: "var(--primary-dark)", textTransform: "capitalize"}}>{user.role}</p>
            </div>
        </div>

        <div style={rightSectionStyle}>
            <div style={tabsContainerStyle}>
                <div style={tabStyle(activeTab === "profile")} onClick={() => setActiveTab("profile")}>Edit Profile</div>
                <div style={tabStyle(activeTab === "mail")} onClick={() => setActiveTab("mail")}>Edit Mail & Security</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>              
                {activeTab === "profile" && (
                    <div className="animate-fade-in">
                        <h2 style={formSectionTitleStyle}>Profile Information</h2>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" {...register("name")} style={inputStyle} />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Birth Date</label>
                            <input type="date" {...register("birthdate")} style={inputStyle} />
                        </div>
                    </div>
                )}

                {activeTab === "mail" && (
                    <div className="animate-fade-in">
                        <h2 style={formSectionTitleStyle}>Email & Security</h2>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Email Address</label>
                            <input type="email" {...register("email")} style={inputStyle} />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>New Password (Optional)</label>
                            <input type="password" placeholder="Leave blank to keep current" {...register("password")} style={inputStyle} />
                        </div>
                    </div>
                )}

                <div style={{ marginTop: "20px", borderTop: "1px solid #E2E8F0", paddingTop: "20px" }}>
                  
                    {successMsg && (
                        <div style={successStyle}>
                            <FiCheck size={18} />
                            {successMsg}
                        </div>
                    )}
                    <button type="submit" style={saveButtonStyle}>Save Changes</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;