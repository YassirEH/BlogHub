const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    summary: {
      type: String,
      required: [true, "Please provide a summary"],
      maxlength: [200, "Summary cannot be more than 200 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Create index for search functionality
BlogSchema.index({ title: "text", content: "text", summary: "text" })

module.exports = mongoose.model("Blog", BlogSchema)

