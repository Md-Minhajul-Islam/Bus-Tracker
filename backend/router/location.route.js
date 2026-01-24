import { Router } from "express";
import { updateLocation, getLocation, sendLocationMail } from "../controllers/location.controller.js";
import isAuthenticated from "../middlewares/common/isAuthenticated.js";

const router = Router();

router.get('/', isAuthenticated, getLocation);
router.post('/', isAuthenticated, updateLocation);
router.post("/send-location-mail", isAuthenticated, sendLocationMail);

export default router;