import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import JWT from "jsonwebtoken";
import { sendSms } from "../utils/sms.js";
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    blood_group,
    location,
    district,
    contact,
  } = req.body;
  if (
    [
      name,
      email,
      password,
      role,
      blood_group,
      location,
      district,
      contact,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "every field is required");
  }
  if (!email.includes("@")) {
    throw new ApiError(400, "enter a valid email address");
  }
  const existUser = await User.findOne({ $or: [{ email }, { contact }] });
  if (existUser) {
    throw new ApiError(400, "User already exists with this email or contact");
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    blood_group,
    location,
    district,
    contact,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong");
  }
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "every field is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "enter a valid password");
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loginUser, "user Logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user Logged out successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) {
    throw new ApiError(401, "Invalid refresh token");
  }
  const decodedToken = JWT.verify(token, process.env.REFRESH_JWT_SECRET);
  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (token !== user?.refreshToken) {
    throw new ApiError(404, "Refresh token not found");
  }
  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();
  user.refreshToken = newRefreshToken;
  user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(200, {}, "Access token refresh successfully");
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid oldPassword");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});
const requestDonor = asyncHandler(async (req, res) => {
  const { Name, bloodgroup, location, hospital, contact, district } = req.body;
  if (
    [Name, bloodgroup, location, hospital, contact].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(4004, "all fields are required");
  }

  console.log({ Name, bloodgroup, location, hospital, contact });
  const donors = await User.find({
    role: "donor",
    blood_group: bloodgroup,
    $and: [
      { location: { $regex: location, $option: "i" } },
      { district: { $regex: district, $option: "i" } },
    ],
  });
  console.log(donors);
  if (donors.length === 0) {
    throw new ApiError(404, "No donor found");
  }
  for (const donor of donors) {
    await sendSms(
      donor.contact,
      `Hello ${donor.name}, ${Name} needs your help. Please contact ${contact} for more information.`
    );
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  requestDonor,
};
