import { Router } from "express";
import { updateLocation, getLocation } from "../controllers/location.controller.js";

const router = Router();

router.get('/', getLocation);
router.post('/', updateLocation);


export default router;