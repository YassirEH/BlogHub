import express from "express";
import { updateProfile, getUserProfile } from "../controllers/users.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/profile").put(protect, updateProfile);

router.route("/:id").get(getUserProfile);

export default router;
