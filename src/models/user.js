import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["donor", "recipient"],
      default: "donor",
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: function () {
        return this.role === "donor";
      },
    },
    location: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  console.log(password);
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateAccessToken = function () {
  return JWT.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      blood_group: this.blood_group,
      availability: this.availability,
    },
    process.env.ACCESS_JWT_SECRET,
    { expiresIn: "1d" }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return JWT.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "10d" }
  );
};
export const User = mongoose.model("User", userSchema);
