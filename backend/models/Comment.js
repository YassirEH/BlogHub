const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide comment content"],
      trim: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Comment", CommentSchema)

