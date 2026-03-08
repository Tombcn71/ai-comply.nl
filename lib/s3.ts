import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize S3 client for Clever Cloud Cellar
const s3Client = new S3Client({
  region: "us-east-1", // Cellar uses us-east-1 as default
  endpoint: `https://${process.env.CELLAR_ADDON_HOST}`,
  credentials: {
    accessKeyId: process.env.CELLAR_ADDON_KEY_ID || "",
    secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET || "",
  },
});

const BUCKET_NAME = "ai-comply-certificates";

/**
 * Upload a file to Cellar S3
 */
export async function uploadCertificateToCellar(
  file: File,
  employeeId: string
): Promise<string> {
  try {
    const fileBuffer = await file.arrayBuffer();
    const fileExtension = file.name.split(".").pop() || "pdf";
    const fileName = `cert_${employeeId}_${Date.now()}.${fileExtension}`;

    console.log("[S3] Uploading file:", fileName);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      ACL: "public-read", // Make file publicly accessible
    });

    await s3Client.send(command);

    // Construct public URL
    const fileUrl = `https://${process.env.CELLAR_ADDON_HOST}/${BUCKET_NAME}/${fileName}`;
    console.log("[S3] File uploaded successfully:", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("[S3] Error uploading file:", error);
    throw new Error(`Failed to upload certificate: ${error}`);
  }
}

export { s3Client };
