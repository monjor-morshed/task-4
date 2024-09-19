import express from "express";
import {
  userController,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.get("/", userController);
router.get("/get", verifyToken, getUsers);
router.post("/update", verifyToken, updateUser);
router.delete("/delete", verifyToken, deleteUser);
export default router;
