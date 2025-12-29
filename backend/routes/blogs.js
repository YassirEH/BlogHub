import express from "express";
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
} from "../controllers/blogs.js";
import { protect, checkBlogOwnership } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { likeBlog } from "../controllers/blogs.js";

const router = express.Router();

router
  .route("/")
  .get(getBlogs)
  .post(protect, upload.single("image"), createBlog);

router.route("/user").get(protect, getUserBlogs);

router
  .route("/:id")
  .get(getBlog)
  .put(protect, checkBlogOwnership, upload.single("image"), updateBlog)
  .delete(protect, checkBlogOwnership, deleteBlog);

// Like a blog

router.route("/:id/like").post(protect, likeBlog);

export default router;
