import { useForm } from "react-hook-form";
import InputGroup from "../components/InputGroup";
import { registerRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    try {
      
      const formData = new FormData();
      
      formData.append("name", data.name);
      formData.append("role", data.role);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("birthdate", data.date);
      formData.append("termsAccepted", data.conditions);
      
      //ADD photo
      if (data.file && data.file[0]) {
          formData.append("image", data.file[0]); 
      }

      console.log("Sending FormData...");
      
      // send formData 
      const res = await registerRequest(formData);
      
      console.log("Server Response:", res.data);
      
      //save user and context
      signin(res.data);
      
      alert("Registration successful! 🎉");
      
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Error: " + (error.response?.data?.message || "Server error"));
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      
      {/* Full Name */}
      <InputGroup
        label="Full Name"
        placeholder="John Doe" 
        name="name"
        register={register}
        error={errors.name}
        rules={{ 
          required: "Full name is required", 
          minLength: { value: 2, message: "Minimum 2 characters" } 
        }}
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
        rules={{ 
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } 
        }}
      />

      {/* Password */}
      <InputGroup
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password}
        rules={{ required: "Password is required" }}
      />

      {/* Birthdate */}
      <InputGroup
        label="Birthdate"
        type="date"
        name="date"
        register={register}
        error={errors.date}
        rules={{ required: "Birthdate is required" }}
      />

      {/* Profile Photo */}
      <div className="form-group">
        <label>Profile Photo</label>
        <input 
          type="file" 
          {...register("file", { required: "Profile photo is required" })} 
          className={errors.file ? "input-error" : ""}
          accept="image/*" //acepted image
        />
        {errors.file && <span className="error-msg">{errors.file.message}</span>}
      </div>

      {/* Terms and Conditions */}
      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input 
          type="checkbox" 
          {...register("conditions", { required: "You must accept the terms" })} 
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