import Bull from 'bull';
import { PrismaClient } from '@prisma/client';
import { analyzeIPA } from './analyzers/ipa.analyzer';
import { analyzeAPK } from './analyzers/apk.analyzer';
import { generateReport } from './report.generator';
import { downloadFile } from './storage.service';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const prisma = new PrismaClient();

export const analysisQueue = new Bull('analysis', REDIS_URL);

// Job data interface
export interface AnalysisJobData {
  analysisId: string;
  userId: string;
  fileKey: string;
  fileName: string;
  format: string;
  platform: string;
}

// Setup job handlers
analysisQueue.process(async (job) => {
  const { analysisId, fileKey, format, platform } = job.data as AnalysisJobData;

  console.log(`Processing job ${job.id}: ${format} on ${platform}`);

  try {
    // Update status to processing
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'processing' },
    });

    job.progress(10);

    // Download file from S3
    const filePath = await downloadFile(fileKey);
    job.progress(30);

    // Parse based on format
    let analysisResult: any;
    if (format === 'ipa' || format === 'app') {
      analysisResult = await analyzeIPA(filePath);
    } else if (format === 'apk' || format === 'aab') {
      analysisResult = await analyzeAPK(filePath);
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    job.progress(70);

    // Generate report
    const report = generateReport(platform as 'ios' | 'android', analysisResult);
    job.progress(90);

    // Save results to database
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'completed',
        healthScore: report.healthScore,
        reportData: report,
        completedAt: new Date(),
      },
    });

    job.progress(100);
    console.log(`✅ Job ${job.id} completed`);
    return { success: true, analysisId, healthScore: report.healthScore };
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);

    // Update status to failed
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'failed' },
    }).catch(err => console.error('Failed to update analysis status:', err));

    throw error;
  }
});

analysisQueue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

analysisQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});

export async function addAnalysisJob(data: AnalysisJobData) {
  return analysisQueue.add(data, {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  });
}
