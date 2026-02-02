import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FiLock, FiAlertCircle, FiLoader, FiCheckCircle } from "react-icons/fi";

const CheckoutForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null); // Limpiar errores previos

    try {
        // 1. Confirm Payment with Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin, 
          },
          redirect: "if_required",
        });

        if (error) {
          // ERROR DE STRIPE (Tarjeta rechazada, fondos insuficientes, etc.)
          setMessage(error.message);
          setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          // ÉXITO
          await onSuccess();
          // No ponemos setIsLoading(false) aquí porque el modal se cerrará solo
        } else {
          setMessage("Unexpected state. Please try again.");
          setIsLoading(false);
        }
    } catch (err) {
        setMessage("Connection error. Please check your internet.");
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ opacity: isLoading ? 0.7 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
      
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#2D3748", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            Secure Checkout 🔒
        </h3>
        <p style={{ color: "#718096", fontSize: "14px", marginBottom: "20px" }}>
           Total a pagar: <b style={{ color: "#2D3748" }}>${amount.toFixed(2)}</b>
        </p>
        
        {/* STRIPE ELEMENT */}
        <div style={{ border: "1px solid #E2E8F0", padding: "15px", borderRadius: "8px", backgroundColor: "#F7FAFC" }}>
            <PaymentElement />
        </div>
      </div>

      {/* MENSAJE DE ERROR (ROJO Y CLARO) */}
      {message && (
        <div style={{ 
            color: "#742A2A", 
            backgroundColor: "#FFF5F5", 
            padding: "12px", 
            borderRadius: "8px", 
            marginBottom: "20px", 
            border: "1px solid #FEB2B2",
            display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" 
        }}>
            <FiAlertCircle size={20} /> 
            <span>{message}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
          <button 
            type="button" 
            onClick={onClose}
            disabled={isLoading}
            style={{ padding: "12px 20px", border: "none", background: "#EDF2F7", color: "#4A5568", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={isLoading || !stripe || !elements}
            style={{ 
                padding: "12px 25px", 
                border: "none", 
                background: isLoading ? "#4A5568" : "#48BB78", // Cambia a gris si carga
                color: "white", 
                borderRadius: "8px", 
                cursor: isLoading ? "wait" : "pointer", 
                fontWeight: "600",
                display: "flex", alignItems: "center", gap: "10px",
                minWidth: "140px",
                justifyContent: "center"
            }}
          >
            {isLoading ? (
                <>
                    <FiLoader className="spin-icon" /> Processing...
                </>
            ) : (
                <>Pay Now</>
            )}
          </button>
      </div>

      {/* CSS para la animación de rotación */}
      <style>{`
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
};

export default CheckoutForm;