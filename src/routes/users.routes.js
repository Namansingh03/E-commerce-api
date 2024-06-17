import {registerUser} from "../controllers/users.controller.js"
import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();

router.route("/register", upload.single("profileImage")).post(registerUser)

export default router