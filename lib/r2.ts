import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 client using the S3-compatible API.
 * R2 is S3-compatible, so we use the AWS SDK with a custom endpoint.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const BUCKET_NAME = "novaai-audio";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

/**
 * Upload audio buffer to R2.
 * @returns The public URL / key for the uploaded audio.
 */
export async function uploadToR2(
  key: string,
  data: Buffer,
  contentType: string = "audio/webm"
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: contentType,
    })
  );

  console.log(`☁️ Uploaded to R2: ${key}`);
  // Return a reference key — we'll serve audio via our own API route
  return `/api/audio/${key}`;
}

/**
 * Get audio from R2 as a readable stream.
 */
export async function getFromR2(key: string): Promise<{
  body: ReadableStream | null;
  contentType: string;
}> {
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );

  return {
    body: response.Body?.transformToWebStream() as ReadableStream || null,
    contentType: response.ContentType || "audio/webm",
  };
}
