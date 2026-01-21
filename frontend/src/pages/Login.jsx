import { useForm } from "react-hook-form";
import InputGroup from "../components/InputGroup"; 
import { loginRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Function SIGN IN
  const { signin, loginWithGoogle } = useAuth();

  const onLogin = handleSubmit(async (data) => {
    try {
      console.log("Attempting login with:", data);
      const res = await loginRequest(data); // Call API
      console.log("Login Success:", res.data);
      signin(res.data); // Save global
      navigate("/home"); // Navigate to Home
      
    } catch (error) {
      console.error("Login error:", error.response?.data);
      alert(error.response?.data?.message || "Invalid credentials");
    }
  });

  // MANAGER OF GOOGLE
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        if (credentialResponse.credential) {
            console.log("Google Token received:", credentialResponse.credential);
            await loginWithGoogle(credentialResponse.credential);
            navigate("/home"); 
        }
    } catch (error) {
        alert("Google Login Failed. Please try again.");
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}> 
        
        {/* GOOGLE BUTTON */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
                theme="outline"
                shape="pill"
                size="medium" // Medium size saves vertical space
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
                    width: "60%" // Takes less space
                }}
            >
                <option value="client">Client</option>
                <option value="admin">Admin</option> 
            </select>
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "-5px" }}>
            <InputGroup
                label="Email"
                type="email"
                placeholder="student@uce.edu.ec"
                name="email"
                register={register}
                error={errors.email}
                rules={{
                required: "Email is required", 
                pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message: "Invalid email format", 
                },
                }}
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
                rules={{ required: "Password is required" }} 
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