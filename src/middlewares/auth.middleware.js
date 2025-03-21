import { User } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import JWT from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
const JWTmiddleware = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "Invalid token");
    }
    const decodeToken = JWT.verify(token, process.env.REFRESH_JWT_SECRET);
    const user = await User.findById(decodeToken.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "something went wrong while validating access token"
    );
  }
});

export { JWTmiddleware };
