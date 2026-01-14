import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save files in the 'uploads' folder in the project root
        // process.cwd() points to the folder where server starts (backend root)
        cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
        // Create a unique name: timestamp-random.png
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter });