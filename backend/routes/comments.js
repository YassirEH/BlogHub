const express = require("express")
const { addComment, getComments, deleteComment } = require("../controllers/comments")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.route("/").post(protect, addComment)

router.route("/:blogId").get(getComments)

router.route("/:id").delete(protect, deleteComment)

module.exports = router

