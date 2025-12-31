import { Router } from "express";
import { signup, login, logout, getApplication, getUser, registerUser, removeApplication, removeUser } from "../controllers/admin.controller.js";
import isAuthenticated from "../middlewares/common/isAuthenticated.js";

const router = Router();
// router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get('/userapplication', isAuthenticated, getApplication);
router.get('/user', isAuthenticated, getUser);
router.post('/registeruser', isAuthenticated, registerUser, removeApplication);
router.post('/removeapplication', isAuthenticated, removeApplication);
router.post('/removeuser', isAuthenticated, removeUser);

export default router;
