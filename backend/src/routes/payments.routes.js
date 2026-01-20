import { Router } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
    const { total } = req.body;

    try {
        const amountInCents = Math.round(total * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            // CHANGE: Force 'card' only. Removed automatic_payment_methods.
            payment_method_types: ['card'], 
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: "Internal Server Error during payment initialization" });
    }
});

export default router;