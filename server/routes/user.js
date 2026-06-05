import express from "express";
import { addUser, getUsers, deleteUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/add", authMiddleware, addUser);
router.get("/", authMiddleware, getUsers);
// router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
