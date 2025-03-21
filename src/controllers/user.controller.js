import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.js";
import { ApiResponse } from "../utils/apiResponse.js";
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
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = { httpOnly: true, secure: true, sameSite: "None", path: "/" };
  return res
    .status(200)
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

const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.isPasswordCorrect(old_password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    user.password = new_password;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const requestDonor = asyncHandler(async (req, res) => {
  const { name, bloodgroup, location, hospital, contact, district } = req.body;
  console.log(req.body);

  if (
    [name, bloodgroup, location, hospital, contact].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(4004, "All fields are required");
  }

  // Finding donors with stricter filtering
  const donors = await User.find({
    role: "donor",
    blood_group: bloodgroup,
    availability: true,
    $or: [
      { location: { $regex: new RegExp(location, "i") } },
      { district: { $regex: new RegExp(district, "i") } },
    ],
    _id: { $ne: req.user._id },
  });

  if (donors.length === 0) {
    throw new ApiError(404, "No donor found");
  }

  const donorIds = donors.map((donor) => donor._id);
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  user.requestedDonors = donorIds;
  await user.save({ validateBeforeSave: false });

  for (const donor of donors) {
    await sendSms(
      donor.contact,
      `Hello ${donor.name}, ${name} needs your help. Please contact ${contact} for more information.`
    );
  }

  res.status(200).json({
    message: "Request sent successfully",
  });
});


const seeDonors = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const donors = user.requestedDonors;
  if (!donors) {
    return res.status(404).json({ message: "No donors found" });
  }
  const donor = await User.find({ _id: { $in: donors } });
  return res.status(200).json({ donors: donor });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  requestDonor,
  seeDonors,
};
