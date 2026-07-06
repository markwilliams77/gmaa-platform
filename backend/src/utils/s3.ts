import { randomUUID } from "crypto";

interface GenerateDocumentKeyParams {
  module: string;
  ownerId: string;
  folder: string;
  fileName: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const generateDocumentKey = ({
  module,
  ownerId,
  folder,
  fileName,
}: GenerateDocumentKeyParams) => {
  const extension = fileName.split(".").pop();

  const name = fileName.replace(/\.[^/.]+$/, "");

  return [
    slugify(module),
    ownerId,
    slugify(folder),
    `${slugify(name)}-${randomUUID()}.${extension}`,
  ].join("/");
};
