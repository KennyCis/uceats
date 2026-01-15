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
    category: {
        type: String,
        // 👇 AGREGAMOS LAS NUEVAS CATEGORÍAS AQUÍ
        enum: ["drinks", "snacks", "food", "others"], 
        default: "others"
    },
    image: {
        type: String, 
        default: null
    },
    // 👇 NUEVO CAMPO PARA EL FILTRO "MOST POPULAR"
    isPopular: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("Product", productSchema);