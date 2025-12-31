import { application, Router } from "express";
import userRoute from "./user.route.js";
import locationRoute from "./location.route.js";
import messageRoute from "./message.route.js";
import isAuthenticated from "../middlewares/common/isAuthenticated.js";
import adminRoute from "./admin.route.js";

const router = Router();
router.use("/user", userRoute);
router.use("/location", isAuthenticated, locationRoute);
router.use("/message", isAuthenticated, messageRoute);
router.use("/admin", adminRoute);

export default router;
