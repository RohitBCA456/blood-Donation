import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
  requestDonor,
  seeDonors,
} from "../controllers/user.controller.js";
import { JWTmiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../upload.js";
console.log("Wait the server is getting ready...");
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(JWTmiddleware, logoutUser);
router
  .route("/change-password")
  .post(upload.none(), JWTmiddleware, changePassword);
router.route("/request").post(upload.none(), JWTmiddleware, requestDonor);
router.route("/donors").get(JWTmiddleware, seeDonors);
export default router;
