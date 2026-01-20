import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentModal = ({ isOpen, onClose, total, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (isOpen && total > 0) {
        // Reset secret when opening to ensure fresh intent
        setClientSecret(""); 
        
        axios.post("http://localhost:3000/api/payments/create-payment-intent", { 
            total: total 
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("Error initiating payment:", err));
    }
  }, [isOpen, total]);

  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "500px",
    maxWidth: "90%",
    // UX FIX: Limit height and enable scrolling
    maxHeight: "90vh", 
    overflowY: "auto", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column"
  };

  const appearance = {
    theme: 'stripe',
    labels: 'floating', // Optional: Makes inputs look cleaner/smaller
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm 
                    amount={total} 
                    onSuccess={onSuccess} 
                    onClose={onClose} 
                />
            </Elements>
        ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "#718096" }}>
                Loading secure payment gateway...
            </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;