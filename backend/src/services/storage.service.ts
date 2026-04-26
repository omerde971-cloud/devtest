import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'devtest-uploads';

export async function uploadFile(
  file: Express.Multer.File,
  userId: string
): Promise<string> {
  const fileKey = `${userId}/${uuid()}/${file.originalname}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return fileKey;
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Failed to upload file');
  }
}

export async function downloadFile(fileKey: string): Promise<string> {
  // Placeholder: in production, download from S3 to temp directory
  // For now, return the fileKey as path
  console.log(`Downloading: ${fileKey}`);
  return `/tmp/${uuid()}/file`;
}

export async function deleteFile(fileKey: string): Promise<void> {
  try {
    // TODO: Implement S3 delete
    console.log(`Deleting: ${fileKey}`);
  } catch (error) {
    console.error('Delete failed:', error);
  }
}
