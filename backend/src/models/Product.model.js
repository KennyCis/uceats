import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String, 
        required: true
    },
    image: {
        type: String, 
        // Default placeholder image if none is provided
        default: "https://cdn-icons-png.flaticon.com/512/1160/1160358.png" 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

export default mongoose.model("Product", productSchema);