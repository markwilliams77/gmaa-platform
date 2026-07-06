import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const privateBucket = process.env.PRIVATE_BUCKET_NAME!;
const publicBucket = process.env.PUBLIC_BUCKET_NAME!;

export const generateUploadUrl = async (
  bucket: "public" | "private",
  key: string,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: bucket === "public" ? publicBucket : privateBucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
};

export const getBucketName = (
  bucket: "public" | "private"
) => {
  return bucket === "public"
    ? publicBucket
    : privateBucket;
};

export const deleteFileFromS3 = async (
  key: string,
  bucket: "public" | "private" = "private"
) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket === "public" ? publicBucket : privateBucket,
    Key: key,
  });

  await s3Client.send(command);
};