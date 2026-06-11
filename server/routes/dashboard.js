import express from "express";
import { getData } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// router.post("/add", authMiddleware, addCategory);
router.get("/", authMiddleware, getData);
// router.put("/:id", authMiddleware, updateCategory);
// router.delete("/:id", authMiddleware, deleteCategory);

export default router;
