import { useState } from "react";
import { useForm } from "react-hook-form";
import InputGroup from "../components/InputGroup"; 
import { loginRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

// ZOD IMPORTS
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schema";

// --- SKELETON COMPONENT ---
const AuthSkeleton = () => (
  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px", animation: "pulse 1.5s infinite" }}>
    <div style={{ height: "40px", backgroundColor: "#E2E8F0", borderRadius: "20px", width: "100%" }}></div>
    <div style={{ height: "1px", backgroundColor: "#E2E8F0", margin: "10px 0" }}></div>
    <div style={{ height: "35px", backgroundColor: "#E2E8F0", borderRadius: "5px", width: "60%" }}></div>
    <div style={{ height: "50px", backgroundColor: "#E2E8F0", borderRadius: "5px" }}></div>
    <div style={{ height: "50px", backgroundColor: "#E2E8F0", borderRadius: "5px" }}></div>
    <div style={{ height: "45px", backgroundColor: "#CBD5E0", borderRadius: "5px", marginTop: "10px" }}></div>
    <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
  </div>
);

function Login() {
  // IMPLEMENT ZOD RESOLVER
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { signin, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const res = await loginRequest(data); 
      signin(res.data); 
      navigate("/home"); 
    } catch (error) {
      setIsLoading(false);
      alert(error.response?.data?.message || "Invalid credentials");
    }
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
        if (credentialResponse.credential) {
            await loginWithGoogle(credentialResponse.credential);
            navigate("/home"); 
        }
    } catch (error) {
        setIsLoading(false);
        alert("Google Login Failed. Please try again.");
    }
  };

  if (isLoading) return <AuthSkeleton />;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}> 
        
        {/* GOOGLE BUTTON */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Google Login Failed")}
                useOneTap
                theme="outline"
                shape="pill"
                size="medium" 
                width="100%" 
                text="signin_with"
            />
        </div>

        {/* COMPACT SEPARATOR */}
        <div style={{ display: "flex", alignItems: "center", fontSize: "11px", color: "#A0AEC0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
            <span style={{ padding: "0 8px" }}>or email</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
        </div>

        <form onSubmit={onLogin} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
        
        {/* ROLE SELECTION */}
        <div className="form-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: 0 }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#4A5568" }}>Role:</label>
            <select 
                {...register("role")}
                style={{ 
                    padding: "4px 8px", 
                    borderRadius: "5px", 
                    border: "1px solid #CBD5E0", 
                    fontSize: "13px",
                    width: "60%" 
                }}
            >
                <option value="client">Client</option>
                <option value="admin">Admin</option> 
            </select>
        </div>

        {/* EMAIL (CLEANER NOW, NO RULES PROP) */}
        <div style={{ marginBottom: "-5px" }}>
            <InputGroup
                label="Email"
                type="email"
                placeholder="student@uce.edu.ec"
                name="email"
                register={register}
                error={errors.email}
            />
        </div>

        {/* PASSWORD */}
        <div style={{ marginBottom: "5px" }}>
            <InputGroup
                label="Password"
                type="password"
                placeholder="••••••••"
                name="password"
                register={register}
                error={errors.password}
            />
        </div>

        <button className="submit-btn" style={{ padding: "10px", marginTop: "5px" }}>
            Sign In
        </button>
        </form>

    </div>
  );
}

export default Login;