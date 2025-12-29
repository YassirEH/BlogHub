const express = require("express")
const { createBlog, getBlogs, getBlog, updateBlog, deleteBlog, getUserBlogs } = require("../controllers/blogs")
const { protect, checkBlogOwnership } = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

router.route("/").get(getBlogs).post(protect, upload.single("image"), createBlog)

router.route("/user").get(protect, getUserBlogs)

router
  .route("/:id")
  .get(getBlog)
  .put(protect, checkBlogOwnership, upload.single("image"), updateBlog)
  .delete(protect, checkBlogOwnership, deleteBlog)

module.exports = router

