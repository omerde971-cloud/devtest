import { mkdirSync, rmSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface APKAnalysis {
  packageName: string;
  versionCode: number;
  versionName: string;
  minSdk: number;
  targetSdk: number;
  supportedAbis: string[];
  permissions: {
    dangerous: string[];
    normal: string[];
  };
  exportedComponents: {
    activities: string[];
    services: string[];
  };
  libraries: string[];
  methodCount: number;
  apkSize: number;
  debuggable: boolean;
  backupAllowed: boolean;
}

const DANGEROUS_PERMISSIONS = [
  'android.permission.CAMERA',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.READ_CONTACTS',
  'android.permission.WRITE_CONTACTS',
  'android.permission.READ_CALENDAR',
  'android.permission.WRITE_CALENDAR',
  'android.permission.CALL_LOG',
  'android.permission.WRITE_CALL_LOG',
  'android.permission.READ_PHONE_STATE',
  'android.permission.READ_PHONE_NUMBERS',
  'android.permission.RECORD_AUDIO',
  'android.permission.READ_SMS',
  'android.permission.RECEIVE_SMS',
  'android.permission.SEND_SMS',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
];

export async function analyzeAPK(filePath: string): Promise<APKAnalysis> {
  const tmpDir = path.join('/tmp', `apk_${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });

  try {
    // Extract APK (it's a ZIP)
    execSync(`unzip -q "${filePath}" -d "${tmpDir}"`);

    // Parse AndroidManifest.xml (requires aapt or apktool)
    // Simplified version - would need proper binary XML parsing
    let packageName = 'unknown';
    let versionCode = 0;
    let versionName = '1.0';
    let minSdk = 21;
    let targetSdk = 33;

    try {
      // Try to extract with aapt2 if available
      const manifest = execSync(`aapt dump badging "${filePath}" 2>/dev/null || echo ""`, {
        encoding: 'utf-8',
      });

      // Parse aapt output
      const pkgMatch = manifest.match(/package: name='([^']+)'/);
      if (pkgMatch) packageName = pkgMatch[1];

      const versionMatch = manifest.match(/versionCode=(\d+)/);
      if (versionMatch) versionCode = parseInt(versionMatch[1]);

      const versionNameMatch = manifest.match(/versionName='([^']+)'/);
      if (versionNameMatch) versionName = versionNameMatch[1];
    } catch (e) {
      // aapt not available, use defaults
    }

    // Count native libraries (ABIs)
    let supportedAbis: string[] = [];
    try {
      const libDir = path.join(tmpDir, 'lib');
      const output = execSync(`ls -d ${libDir}/*/ 2>/dev/null | xargs -n1 basename || echo ""`, {
        encoding: 'utf-8',
      });
      supportedAbis = output.trim().split('\n').filter((x) => x);
    } catch (e) {
      supportedAbis = ['armeabi-v7a', 'arm64-v8a']; // Default
    }

    // Calculate APK size
    const apkSize = parseInt(
      execSync(`stat -f%z "${filePath}" 2>/dev/null || stat -c%s "${filePath}"`, {
        encoding: 'utf-8',
      }).trim()
    );

    return {
      packageName,
      versionCode,
      versionName,
      minSdk,
      targetSdk,
      supportedAbis,
      permissions: {
        dangerous: [],
        normal: [],
      },
      exportedComponents: {
        activities: [],
        services: [],
      },
      libraries: ['androidx.appcompat', 'androidx.core'], // Placeholder
      methodCount: 50000, // Placeholder
      apkSize,
      debuggable: false,
      backupAllowed: false,
    };
  } finally {
    // Cleanup
    rmSync(tmpDir, { recursive: true, force: true });
  }
}
