import Product from "../models/Product.model.js";

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
        const { name, price, category, image } = req.body;

        const newProduct = new Product({
            name,
            price,
            category,
            image
        });

        //save to DB
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
        
    } catch (error) {
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

        return res.sendStatus(204); // 204 means "No Content" (Success but nothing to return)
        
    } catch (error) {
        return res.status(500).json({ message: "Error deleting product" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // { new: true } returns the updated object instead of the old one
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
        
    } catch (error) {
        return res.status(500).json({ message: "Error updating product" });
    }
};