import { prisma } from "../configs/db";

export const createLeadActivity = async ({
  leadId,
  activity,
  description,
  createdBy,
}: {
  leadId: string;
  activity: string;
  description?: string;
  createdBy?: string;
}) => {
  return prisma.leadActivity.create({
    data: {
      leadId,
      activity,
      description,
      createdBy,
    },
  });
};