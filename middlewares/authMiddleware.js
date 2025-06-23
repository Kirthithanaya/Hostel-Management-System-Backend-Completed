import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes (authentication)
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header with Bearer token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check for admin role
export const adminOnly = (req, res, next) => {
  req.user = { role: "admin" }; // simulated role
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

// Middleware to check for specific roles (e.g., staff or admin)
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied for ${req.user.role}` });
    }
    next();
  };
};

export const isResident = (req, res, next) => {
  if (req.user && req.user.role === "resident") {
    next(); // Allow access
  } else {
    res.status(403).json({
      message: "Access denied. Residents only.",
    });
  }
};

// middleware/verifyToken.js

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Include `id` only
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
