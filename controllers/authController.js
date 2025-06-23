import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "resident",
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: { email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token to DB
    user.resetToken = hashedToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Generate reset link
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    // TODO: send via email using Nodemailer (for now, return in response)
    res.status(200).json({
      message: "Password reset link generated.",
      resetLink,
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating reset token." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the token received from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with matching token and check if token is still valid
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear the reset token fields
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password." });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // If using cookies (optional - only if JWT is in a cookie)
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Always return success response
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("GetAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
