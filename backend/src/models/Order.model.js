import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending", // pending, completed
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    // 👇 NUEVO CAMPO: Para ocultar la orden al Admin sin borrarla
    archived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("Order", orderSchema);