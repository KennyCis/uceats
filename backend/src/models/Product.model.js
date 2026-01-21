import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0 
    },
    category: {
        type: String,
        enum: ["drinks", "snacks", "food", "others"], 
        default: "others"
    },
    image: {
        type: String, 
        default: null
    },
    isPopular: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);