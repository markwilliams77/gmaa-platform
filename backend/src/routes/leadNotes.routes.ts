import express from "express";
import {
  createLeadNote,
  getLeadNotes,
} from "../controllers/leadNotes.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/:id/notes", authMiddleware, allowRoles(Role.ADMIN), createLeadNote);
router.get("/:id/notes", authMiddleware, allowRoles(Role.ADMIN), getLeadNotes);

export default router;