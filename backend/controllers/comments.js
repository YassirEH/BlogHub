import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// @desc    Add comment
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content, blogId } = req.body;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      blog: blogId,
      user: req.user.id,
    });

    // Add comment to blog
    blog.comments.push(comment._id);
    await blog.save();

    // Populate user info
    await comment.populate("user", "name");

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Remove comment from blog
    const blog = await Blog.findById(comment.blog);
    if (blog) {
      blog.comments = blog.comments.filter(
        (commentId) => commentId.toString() !== req.params.id
      );
      await blog.save();
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
