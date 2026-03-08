import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize S3 client for Clever Cloud Cellar
const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: `https://${process.env.CELLAR_ADDON_HOST}`,
  credentials: {
    accessKeyId: process.env.CELLAR_ADDON_KEY_ID || "",
    secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET || "",
  },
  forcePathStyle: true, // Required for Clever Cloud Cellar
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
    console.log("[S3] Starting upload process");
    console.log("[S3] Environment check:", {
      host: process.env.CELLAR_ADDON_HOST ? "✓" : "✗",
      keyId: process.env.CELLAR_ADDON_KEY_ID ? "✓" : "✗",
      keySecret: process.env.CELLAR_ADDON_KEY_SECRET ? "✓" : "✗",
    });

    const fileBuffer = await file.arrayBuffer();
    const fileExtension = file.name.split(".").pop() || "pdf";
    const fileName = `cert_${employeeId}_${Date.now()}.${fileExtension}`;

    console.log("[S3] File details:", {
      fileName,
      size: file.size,
      type: file.type,
      employeeId,
    });

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);

    // Construct public URL exactly as specified
    const fileUrl = `https://${process.env.CELLAR_ADDON_HOST}/${BUCKET_NAME}/${fileName}`;
    
    console.log("[S3] Upload SUCCESS", {
      fileName,
      url: fileUrl,
      bucket: BUCKET_NAME,
      timestamp: new Date().toISOString(),
    });

    return fileUrl;
  } catch (error) {
    console.error("[S3] Upload FAILED", {
      employeeId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`Failed to upload certificate: ${error}`);
  }
}

export { s3Client };
