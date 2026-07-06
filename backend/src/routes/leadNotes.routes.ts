import express from "express";
import {
  createLeadNote,
  getLeadNotes,
} from "../controllers/leadNotes.controllers";

const router = express.Router();

router.post("/:id/notes", createLeadNote);
router.get("/:id/notes", getLeadNotes);

export default router;