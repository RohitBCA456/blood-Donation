import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestDonor,
} from "../controllers/user.controller.js";
import { JWTmiddleware } from "../middlewares/auth.middleware.js";
console.log("Wait the server is getting ready...");
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(JWTmiddleware, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(JWTmiddleware, changePassword);
router.route("/request").post(requestDonor);
export default router;
