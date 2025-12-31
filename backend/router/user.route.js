import { Router } from "express";
import { signup, login, logout, updateProfile, removeUser } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/common/isAuthenticated.js";

const router = Router();
router.post("/signup", singleUpload, signup);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.post('/profile/update', isAuthenticated, singleUpload, updateProfile);
router.post('/profile/delete', isAuthenticated, removeUser);
export default router;
