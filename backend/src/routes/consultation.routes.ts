import { Router } from "express";
import {
  createConsultation,
  getConsultations,
  updateConsultation,
  convertConsultationToLead,
} from "../controllers/consultation.controller";

const router = Router();

router.get("/", getConsultations);
router.post("/", createConsultation);
router.patch("/:id", updateConsultation);
router.post( "/:id/convert-to-lead", convertConsultationToLead);

export default router;