import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/comments.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, addComment);

router.route("/:blogId").get(getComments);

router.route("/:id").delete(protect, deleteComment);

export default router;
