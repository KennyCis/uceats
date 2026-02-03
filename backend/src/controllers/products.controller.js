import Product from "../models/Product.model.js";

// Helper function to get full image URL
const getImageUrl = (req) => {
    if (!req.file) return null; // No file uploaded
    // Returns: http://3.88.179.56:3000/uploads/filename.png
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
        // FIXED: Added 'stock' and 'isPopular' to destructuring
        const { name, price, category, stock, isPopular } = req.body;
        
        // Handle Image
        let imageUrl = "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"; // Default
        if (req.file) {
            imageUrl = getImageUrl(req);
        }

        const newProduct = new Product({
            name,
            price,
            category,
            stock,     // Now saving stock
            isPopular, // Now saving popular status
            image: imageUrl 
        });

        const savedProduct = await newProduct.save();

        // SOCKET.IO EMIT: Notify clients about the new product
        req.io.emit("server:newproduct", savedProduct);

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

        // SOCKET.IO EMIT: Notify clients to remove this product
        req.io.emit("server:deleteproduct", id);

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

        // SOCKET.IO EMIT: Notify clients about the update
        req.io.emit("server:updateproduct", updatedProduct);

        res.json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: "Error updating product" });
    }
};