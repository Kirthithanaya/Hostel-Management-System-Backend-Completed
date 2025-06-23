import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "resident"],
      default: "resident",
    },
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
