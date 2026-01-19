import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // user client
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    // List products
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", 
                required: true
            },
            name: String, 
            price: Number, 
            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    total: {
        type: Number,
        required: true
    },
    // CAMP TRIPE/PAYPAL
    isPaid: {
        type: Boolean,
        default: false // false Stripe confirm
    },
    paymentId: {
        type: String, // SAVE ID
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "cancelled"], 
        default: "pending"
    }
}, {
    timestamps: true 
});

export default mongoose.model("Order", orderSchema);