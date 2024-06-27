import express from "express";
import {
  getUserById,
  login,
  protect,
  signup,
  updatePassword,
} from "../controllers/user.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getUser/:id", getUserById);
router.put("/update", protect, updatePassword);

export default router;
