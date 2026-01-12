function InputGroup({ label, type = "text", placeholder, register, name, rules, error }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={error ? "input-error" : ""}
      />
      
      {error && (
        <span className="error-msg">
          {error.message || "This field is required"}
        </span>
      )}
    </div>
  );
}

export default InputGroup;