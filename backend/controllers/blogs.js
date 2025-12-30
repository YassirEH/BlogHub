import fs from "fs";
import path from "path";
import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, summary, tags, published } = req.body;

    // Create blog data object
    const blogData = {
      title,
      content,
      summary,
      tags: tags || [],
      published: published !== undefined ? published : true,
      author: req.user.id,
    };

    // Add image path if file was uploaded
    if (req.file) {
      blogData.image = `/uploads/${req.file.filename}`;
    }

    // Create blog
    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Search functionality
    const search = req.query.search || "";
    let query = { published: true };

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Execute query
    const blogs = await Blog.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total documents
    const total = await Blog.countDocuments(query);

    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id)
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name",
        },
      });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment views by 1
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Make sure user is blog owner
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }

    // Create update data object
    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (blog.image) {
        const oldImagePath = path.join(__dirname, "..", blog.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Add new image path
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Update blog
    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Make sure user is blog owner
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this blog",
      });
    }

    // Delete image if exists
    if (blog.image) {
      const imagePath = path.join(__dirname, "..", blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await blog.deleteOne();

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

export const getUserBlogs = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Blog.countDocuments({ author: req.user.id });

    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Optionally, prevent multiple likes per user by tracking user IDs in a likes array
    // For now, just increment the likes count
    blog.likes = (blog.likes || 0) + 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: { likes: blog.likes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
