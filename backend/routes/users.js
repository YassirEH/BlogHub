const express = require("express")
const { updateProfile, getUserProfile } = require("../controllers/users")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.route("/profile").put(protect, updateProfile)

router.route("/:id").get(getUserProfile)

module.exports = router

