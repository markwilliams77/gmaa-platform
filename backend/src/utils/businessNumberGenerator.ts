import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateBusinessNumber = async (
  prefix: string,
  model: any,
  field: string,
): Promise<string> => {
  const currentYear = new Date().getFullYear();

  const latestRecord = await model.findFirst({
    where: {
      [field]: {
        not: null,
      },
    },
    orderBy: {
      [field]: "desc",
    },
  });

  let nextSequence = 1;

  if (latestRecord?.[field]) {
    const parts = latestRecord[field].split("-");

    if (parts.length === 3) {
      nextSequence = Number(parts[2]) + 1;
    }
  }

  return `${prefix}-${currentYear}-${String(nextSequence).padStart(6, "0")}`;
};