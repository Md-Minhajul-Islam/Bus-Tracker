import { Router } from "express";
import {
  signup,
  login,
  logout,
  getApplication,
  getUser,
  registerUser,
  removeApplication,
  removeUser,
  getRoutes,
  createRoute,
  updateRoute,
  removeRoute,
} from "../controllers/admin.controller.js";
import isAuthenticated from "../middlewares/common/isAuthenticated.js";

const router = Router();
// router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/userapplication", isAuthenticated, getApplication);
router.get("/user", isAuthenticated, getUser);
router.post("/registeruser", isAuthenticated, registerUser, removeApplication);
router.post("/removeapplication", isAuthenticated, removeApplication);
router.post("/removeuser", isAuthenticated, removeUser);
router.get("/getRoutes", isAuthenticated, getRoutes);
router.post("/createRoute", isAuthenticated, createRoute);
router.post("/updateRoute", isAuthenticated, updateRoute);
router.post("/removeRoute", isAuthenticated, removeRoute);

export default router;
