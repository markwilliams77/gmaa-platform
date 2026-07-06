import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { createLeadActivity } from "../services/activity.service";

export const createLeadNote = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { note, createdBy } = req.body;

    if (!note) {
      return res.status(400).json({
        message: "Note is required",
      });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const leadNote = await prisma.leadNote.create({
      data: {
        leadId: id,
        note,
        createdBy: createdBy || "SYSTEM",
      },
    });

    await createLeadActivity({
      leadId: id,
      activity: "NOTE_ADDED",
      description: note,
      createdBy: createdBy || "SYSTEM",
    });

    return res.status(201).json(leadNote);
  } catch (error) {
    console.error("createLeadNote error:", error);

    return res.status(500).json({
      message: "Failed to create note",
    });
  }
};

export const getLeadNotes = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const notes = await prisma.leadNote.findMany({
      where: {
        leadId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(notes);
  } catch (error) {
    console.error("getLeadNotes error:", error);

    return res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};