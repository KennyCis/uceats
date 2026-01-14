import { Router } from "express";
import { register, login, updateProfile} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";


const router = Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.put("/profile/:id", upload.single("image"), updateProfile);

export default router;