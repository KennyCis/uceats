import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const CheckoutForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }

    setIsLoading(true);

    // 1. Confirm Payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // No redirect needed for credit cards, usually. 
        // We handle logic manually below.
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // 2. Payment Success! Now we create the Order in our Database
      await onSuccess();
      setIsLoading(false);
    } else {
      setMessage("Unexpected state.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#2D3748", marginBottom: "10px" }}>Secure Checkout 🔒</h3>
        <p style={{ color: "#718096", fontSize: "14px", marginBottom: "20px" }}>
           Total to pay: <b style={{ color: "#2D3748" }}>${amount.toFixed(2)}</b>
        </p>
        
        {/* STRIPE SECURE INPUT */}
        <div style={{ border: "1px solid #E2E8F0", padding: "15px", borderRadius: "8px" }}>
            <PaymentElement />
        </div>
      </div>

      {message && (
        <div style={{ color: "#C53030", backgroundColor: "#FFF5F5", padding: "10px", borderRadius: "5px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
            <FiAlertCircle /> {message}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button 
            type="button" 
            onClick={onClose}
            style={{ padding: "10px 20px", border: "none", background: "#EDF2F7", color: "#4A5568", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={isLoading || !stripe || !elements}
            style={{ 
                padding: "10px 25px", 
                border: "none", 
                background: isLoading ? "#A0AEC0" : "#48BB78", 
                color: "white", 
                borderRadius: "8px", 
                cursor: isLoading ? "not-allowed" : "pointer", 
                fontWeight: "600",
                display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            {isLoading ? "Processing..." : <><FiLock /> Pay Now</>}
          </button>
      </div>
    </form>
  );
};

export default CheckoutForm;