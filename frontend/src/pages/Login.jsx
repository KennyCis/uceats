import { useForm } from "react-hook-form";
import InputGroup from "../components/InputGroup"; 

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onLogin = handleSubmit((data) => {
    console.log("LOGIN DATA:", data);
  });

  return (
    <form onSubmit={onLogin} style={{ width: "100%" }}>
      
      {/* ROLE SELECTION */}
      <div className="form-group">
        <label>Role</label>
        <select {...register("role")}>
          <option value="client">Client</option>
          <option value="admin">Admin</option> 
        </select>
      </div>

      {/* EMAIL */}
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

      {/* PASSWORD */}
      <InputGroup
        label="Password"
        type="password"
        placeholder="••••••••"
        name="password"
        register={register}
        error={errors.password}
        rules={{ required: "Password is required" }} 
      />

      <button className="submit-btn">Sign In</button>
    </form>
  );
}

export default Login;