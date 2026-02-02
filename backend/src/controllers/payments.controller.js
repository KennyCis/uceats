import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    const { total } = req.body;

    try {
        const amountInCents = Math.round(total * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            payment_method_types: ['card'], 
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: "Internal Server Error during payment initialization" });
    }
};