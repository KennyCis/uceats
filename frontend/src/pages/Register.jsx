import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputGroup from "../components/InputGroup";
import { registerRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

// ZOD IMPORTS
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth.schema";

// --- REGISTER SKELETON ---
const RegisterSkeleton = () => (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px", animation: "pulse 1.5s infinite" }}>
      <div style={{ height: "50px", backgroundColor: "#E2E8F0", borderRadius: "5px" }}></div>
      <div style={{ height: "40px", backgroundColor: "#E2E8F0", borderRadius: "5px", width: "50%" }}></div>
      <div style={{ height: "50px", backgroundColor: "#E2E8F0", borderRadius: "5px" }}></div>
      <div style={{ height: "50px", backgroundColor: "#E2E8F0", borderRadius: "5px" }}></div>
      <div style={{ height: "50px", backgroundColor: "#E2E8F0", borderRadius: "5px" }}></div>
      <div style={{ height: "40px", backgroundColor: "#E2E8F0", borderRadius: "5px" }}></div>
      <div style={{ height: "45px", backgroundColor: "#CBD5E0", borderRadius: "5px", marginTop: "10px" }}></div>
      <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
    </div>
  );

function Register() {
  // IMPLEMENT ZOD RESOLVER
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });
  
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("role", data.role);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("birthdate", data.date); 
      formData.append("termsAccepted", data.conditions); // Zod already checked this is true
      
      if (data.file && data.file[0]) {
          formData.append("image", data.file[0]); 
      }

      const res = await registerRequest(formData);
      
      signin(res.data);
      navigate("/home");
      
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      alert("Registration failed. Please check your data.");
    }
  });

  if (isLoading) return <RegisterSkeleton />;

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      
      {/* Full Name */}
      <InputGroup
        label="Full Name"
        placeholder="John Doe" 
        name="name"
        register={register}
        error={errors.name}
      />

      {/* Role Selection */}
      <div className="form-group">
        <label>Role</label>
        <select {...register("role")}>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Email */}
      <InputGroup
        label="Email"
        type="email"
        placeholder="student@uce.edu.ec"
        name="email"
        register={register}
        error={errors.email}
      />

      {/* Password */}
      <InputGroup
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password}
      />

      {/* Birthdate */}
      <InputGroup
        label="Birthdate"
        type="date"
        name="date"
        register={register}
        error={errors.date}
      />

      {/* Profile Photo */}
      <div className="form-group">
        <label>Profile Photo</label>
        <input 
          type="file" 
          {...register("file")} 
          className={errors.file ? "input-error" : ""}
          accept="image/*"
        />
        {errors.file && <span className="error-msg">{errors.file.message}</span>}
      </div>

      {/* Terms and Conditions */}
      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input 
          type="checkbox" 
          {...register("conditions")} 
          id="terms"
          style={{ width: "auto", margin: 0 }}
        />
        <label htmlFor="terms" style={{ margin: 0, fontWeight: "normal", color: "#555" }}>
          I accept the terms and conditions 
        </label>
      </div>
      {errors.conditions && <span className="error-msg">{errors.conditions.message}</span>}

      <button className="submit-btn">Create Account</button>
    </form>
  );
}

export default Register;