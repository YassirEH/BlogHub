import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Check if user is blog owner
export const checkBlogOwnership = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user is blog owner
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
