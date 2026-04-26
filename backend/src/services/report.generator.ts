import { IPAAnalysis } from './analyzers/ipa.analyzer';
import { APKAnalysis } from './analyzers/apk.analyzer';

export interface AnalysisReport {
  metadata: {
    appName: string;
    bundleId?: string;
    packageName?: string;
    version: string;
    buildNumber?: string;
    platform: 'ios' | 'android';
    minOS: string;
  };
  security: {
    riskLevel: 'low' | 'medium' | 'high';
    findings: string[];
  };
  size: {
    total: number;
    executable: number;
    assets: number;
  };
  frameworks?: string[];
  healthScore: number;
}

function calculateHealthScore(platform: 'ios' | 'android', data: any): number {
  let score = 100;

  if (platform === 'ios') {
    const ipa = data as IPAAnalysis;

    // Old iOS version penalty
    const minVersion = parseFloat(ipa.minIOSVersion);
    if (minVersion < 14) score -= 10;

    // Missing frameworks is not a penalty
  } else {
    const apk = data as APKAnalysis;

    // Old Android version penalty
    if (apk.minSdk < 24) score -= 10;

    // Debuggable penalty
    if (apk.debuggable) score -= 15;

    // Backup allowed penalty
    if (apk.backupAllowed) score -= 10;

    // Too many dangerous permissions
    if (apk.permissions.dangerous.length > 10) score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

export function generateReport(
  platform: 'ios' | 'android',
  analysis: IPAAnalysis | APKAnalysis
): AnalysisReport {
  const healthScore = calculateHealthScore(platform, analysis);
  const riskLevel = healthScore >= 80 ? 'low' : healthScore >= 50 ? 'medium' : 'high';

  if (platform === 'ios') {
    const ipa = analysis as IPAAnalysis;
    return {
      metadata: {
        appName: ipa.appName,
        bundleId: ipa.bundleId,
        version: ipa.version,
        buildNumber: ipa.buildNumber,
        platform: 'ios',
        minOS: ipa.minIOSVersion,
      },
      security: {
        riskLevel,
        findings: [
          `App supports iOS ${ipa.minIOSVersion} and above`,
          `Uses ${ipa.frameworks.length} frameworks`,
          ipa.architectures.includes('arm64e')
            ? '✅ Supports ARM64e (Pointer Authentication)'
            : '⚠️ Missing ARM64e support',
        ],
      },
      size: {
        total: ipa.appSize,
        executable: ipa.executable,
        assets: ipa.assets,
      },
      frameworks: ipa.frameworks,
      healthScore,
    };
  } else {
    const apk = analysis as APKAnalysis;
    return {
      metadata: {
        appName: apk.packageName,
        packageName: apk.packageName,
        version: apk.versionName,
        platform: 'android',
        minOS: `Android API ${apk.minSdk}`,
      },
      security: {
        riskLevel,
        findings: [
          `Target SDK: ${apk.targetSdk}${apk.targetSdk >= 33 ? ' ✅' : ' ⚠️'}`,
          `Debuggable: ${apk.debuggable ? '❌ Yes (security risk)' : '✅ No'}`,
          `Backup allowed: ${apk.backupAllowed ? '⚠️ Yes' : '✅ No'}`,
          `Dangerous permissions: ${apk.permissions.dangerous.length}`,
        ],
      },
      size: {
        total: apk.apkSize,
        executable: apk.apkSize / 2,
        assets: apk.apkSize / 2,
      },
      healthScore,
    };
  }
}
