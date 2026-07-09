import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "images");

export interface MarketplaceGalleryImage {
  localFilePath: string;
  fileName: string;
  folder: string;
  caption: string;
}

export function getRandomGalleryImages(
  folder: string,
  count = 6,
): MarketplaceGalleryImage[] {
  const folderPath = path.join(ROOT, folder);

  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const files = fs
    .readdirSync(folderPath)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

  const shuffled = [...files].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map((file, index) => ({
    localFilePath: path.join(folderPath, file),
    fileName: file,
    folder,
    caption: `Facility Image ${index + 1}`,
  }));
}