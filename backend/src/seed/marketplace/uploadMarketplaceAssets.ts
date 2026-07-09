import fs from "fs";
import path from "path";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

const bucket = process.env.PUBLIC_BUCKET_NAME!;

export const uploadMarketplaceAsset = async (
  localFilePath: string,
  folder: string,
) => {
  const fileName = path.basename(localFilePath);

  const key = `marketplace/${folder}/${fileName}`;

  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch {
    // File doesn't exist. Continue with upload.
  }

  const body = fs.readFileSync(localFilePath);

  const extension = path.extname(localFilePath).toLowerCase();

  const contentType =
    extension === ".png"
      ? "image/png"
      : extension === ".webp"
      ? "image/webp"
      : "image/jpeg";

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};