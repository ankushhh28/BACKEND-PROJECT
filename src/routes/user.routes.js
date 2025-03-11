import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// routes
router.route("/register").post(
  //* ejecting multer middleware for handle file uploads
  //* Agar aap form me alag-alag fields se multiple files upload karna chahte ho (e.g., ek field profile image ke liye aur ek documents ke liye), toh upload.fields([]) ka use karte hain....
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default router;
