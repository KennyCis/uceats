import Product from "../models/Product.model.js";

// Helper function to get full image URL
const getImageUrl = (req) => {
    if (!req.file) return null; // No file uploaded
    // Returns: http://localhost:3000/uploads/filename.png
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};

// Function to get all products (for the HomePage grid)
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Function to create a new product (for the Modal)
export const createProduct = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        // Handle Image
        let imageUrl = "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"; // Default
        if (req.file) {
            imageUrl = getImageUrl(req);
        }
        const newProduct = new Product({
            name,
            price,
            category,
            image: imageUrl // Save the URL in DB
        });
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating product" });
    }
};

// Function to delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.sendStatus(204); 
    } catch (error) {
        return res.status(500).json({ message: "Error deleting product" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Create update object
        const updates = { ...req.body };
        if (req.file) {
            updates.image = getImageUrl(req);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: "Error updating product" });
    }
};