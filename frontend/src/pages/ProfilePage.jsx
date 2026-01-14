import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCamera } from "react-icons/fi";
import { useForm } from "react-hook-form";
import axios from "axios";
import logo from "../assets/logo-uceats.png";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user, updateUser } = useAuth(); 
  const [activeTab, setActiveTab] = useState("profile");
  
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      if (user.birthdate) {
        setValue("birthdate", user.birthdate.split('T')[0]);
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
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

      const res = await axios.put(`http://localhost:3000/api/profile/${user.id}`, formData);
      

      updateUser(res.data);
      
      alert("Profile updated successfully! ✅");

    } catch (error) {
      console.error(error);
      alert("Error updating profile ❌");
    }
  };

  // --- STYLES ---
  const containerStyle = { minHeight: "100vh", backgroundColor: "#F8FAFC" };
  const topNavStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", backgroundColor: "white", borderBottom: "1px solid #E2E8F0" };
  const backLinkStyle = { display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--primary-dark)", fontWeight: "600" };
  const mainContentStyle = { maxWidth: "1100px", margin: "40px auto", display: "flex", gap: "30px", padding: "0 20px" };
  const leftCardStyle = { flex: "1", maxWidth: "300px", backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "var(--shadow-card)", height: "fit-content", textAlign: "center" };
  const rightSectionStyle = { flex: "2", backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "var(--shadow-card)" };
  const tabsContainerStyle = { display: "flex", borderBottom: "2px solid #E2E8F0", marginBottom: "30px" };
  const tabStyle = (isActive) => ({ padding: "15px 25px", cursor: "pointer", fontWeight: "600", color: isActive ? "var(--primary-dark)" : "#718096", borderBottom: isActive ? "3px solid var(--primary-blue)" : "3px solid transparent", marginBottom: "-2px" });
  const formSectionTitleStyle = { color: "var(--primary-dark)", marginBottom: "25px", fontSize: "24px" };
  const inputGroupStyle = { marginBottom: "20px" };
  const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--primary-dark)" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #CBD5E0", backgroundColor: "#F8FAFC", fontSize: "14px", boxSizing: "border-box" };
  const saveButtonStyle = { backgroundColor: "var(--primary-dark)", color: "white", border: "none", padding: "12px 30px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", marginTop: "10px" };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={containerStyle}>
      {/* Top Nav */}
      <div style={topNavStyle}>
        <Link to="/home" style={backLinkStyle}>
          <FiArrowLeft size={20} />
          Back to Home
        </Link>
        <img src={logo} alt="UCEats Logo" style={{ height: "50px", objectFit: "contain" }} />
        <div style={{width: 100}}></div> 
      </div>

      <div style={mainContentStyle}>
        
        {/* --- LEFT CARD--- */}
        <div style={leftCardStyle}>
            
            <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 20px" }}>
                <img 
                    src={user.image || "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #EDF2F7" }} 
                />
                
                
                <label style={{ position: "absolute", bottom: "0", right: "0", backgroundColor: "var(--primary-blue)", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
                    <FiCamera size={16} />
                    <input type="file" style={{ display: "none" }} accept="image/*" {...register("image")} />
                </label>
            </div>

            <h2 style={{margin: "0 0 5px 0", color: "var(--primary-dark)"}}>{user.name}</h2>
            <p style={{margin: "0 0 20px 0", color: "#718096"}}>{user.email}</p>
            <div style={{borderTop: "1px solid #E2E8F0", paddingTop: "20px", textAlign: "left"}}>
                <small style={{color: "#718096"}}>Role</small>
                <p style={{margin: "5px 0 0 0", fontWeight: "600", color: "var(--primary-dark)", textTransform: "capitalize"}}>{user.role}</p>
            </div>
        </div>

        {/* --- RIGHT SECTION --- */}
        <div style={rightSectionStyle}>
            {/* Tabs */}
            <div style={tabsContainerStyle}>
                <div style={tabStyle(activeTab === "profile")} onClick={() => setActiveTab("profile")}>
                    Edit Profile
                </div>
                <div style={tabStyle(activeTab === "mail")} onClick={() => setActiveTab("mail")}>
                    Edit Mail & Security
                </div>
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

                {/* --- MAIL Y PASSWORD --- */}
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

                {/* BUTTON SAVE */}
                <div style={{ marginTop: "20px", borderTop: "1px solid #E2E8F0", paddingTop: "20px" }}>
                    <button type="submit" style={saveButtonStyle}>Save Changes</button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;