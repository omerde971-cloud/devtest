import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { writeFileSync, mkdirSync, existsSync, readFileSync, unlinkSync } from 'fs';
import path from 'path';

const USE_LOCAL = !process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your-key';
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (USE_LOCAL) {
  if (!existsSync(LOCAL_UPLOADS_DIR)) mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
  console.log('📁 Storage: Local filesystem (uploads/)');
} else {
  console.log('☁️  Storage: S3/R2 cloud storage');
}

const s3Client = USE_LOCAL ? null : new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'devtest-uploads';

export async function uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
  const fileKey = `${userId}/${uuid()}/${file.originalname}`;

  if (USE_LOCAL) {
    const userDir = path.join(LOCAL_UPLOADS_DIR, userId);
    if (!existsSync(userDir)) mkdirSync(userDir, { recursive: true });
    const filePath = path.join(LOCAL_UPLOADS_DIR, fileKey.replace(/\//g, '_'));
    writeFileSync(filePath, file.buffer);
    return filePath;
  }

  await s3Client!.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  return fileKey;
}

export async function downloadFile(fileKey: string): Promise<string> {
  if (USE_LOCAL) {
    return existsSync(fileKey) ? fileKey : fileKey;
  }
  return fileKey;
}

export async function deleteFile(fileKey: string): Promise<void> {
  if (USE_LOCAL) {
    try { if (existsSync(fileKey)) unlinkSync(fileKey); } catch {}
    return;
  }
  try {
    await s3Client!.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: fileKey }));
  } catch (error) {
    console.error('Delete failed:', error);
  }
}
