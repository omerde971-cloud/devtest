import { createReadStream } from 'fs';
import { createWriteStream } from 'fs';
import { mkdirSync, rmSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import plist from 'plist';

export interface IPAAnalysis {
  appName: string;
  bundleId: string;
  version: string;
  buildNumber: string;
  minIOSVersion: string;
  supportedDevices: string[];
  architectures: string[];
  entitlements: string[];
  frameworks: string[];
  codeSigningInfo: {
    teamId: string;
    certificateExpiry?: string;
  };
  appSize: number;
  executable: number;
  assets: number;
}

export async function analyzeIPA(filePath: string): Promise<IPAAnalysis> {
  const tmpDir = path.join('/tmp', `ipa_${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });

  try {
    // Extract IPA (it's a ZIP)
    execSync(`unzip -q "${filePath}" -d "${tmpDir}"`);

    // Find the .app directory
    const appDir = path.join(tmpDir, 'Payload');
    const files = execSync(`find ${appDir} -maxdepth 1 -type d -name "*.app"`, {
      encoding: 'utf-8',
    }).trim();

    if (!files) {
      throw new Error('No .app directory found in IPA');
    }

    const appPath = files.split('\n')[0];
    const infoPath = path.join(appPath, 'Info.plist');

    // Parse Info.plist
    const infoPlistContent = execSync(`cat "${infoPath}"`, {
      encoding: 'utf-8',
    });
    const infoPlist = plist.parse(infoPlistContent) as any;

    // Extract entitlements
    const entitlementsPath = path.join(appPath, '_CodeSignature/CodeResources');
    let entitlements: string[] = [];
    try {
      // Simplified entitlements parsing
      if (infoPlist.UIRequiredDeviceCapabilities) {
        entitlements = infoPlist.UIRequiredDeviceCapabilities as string[];
      }
    } catch (e) {
      // entitlements parsing is optional
    }

    // List frameworks
    const frameworksPath = path.join(appPath, 'Frameworks');
    let frameworks: string[] = [];
    try {
      const output = execSync(`find ${frameworksPath} -maxdepth 1 -type d -name "*.framework" 2>/dev/null || true`, {
        encoding: 'utf-8',
      });
      frameworks = output
        .trim()
        .split('\n')
        .filter((f) => f)
        .map((f) => path.basename(f, '.framework'));
    } catch (e) {
      // frameworks might not exist
    }

    // Calculate sizes
    const appSize = parseInt(
      execSync(`du -sb "${appPath}" | cut -f1`, {
        encoding: 'utf-8',
      }).trim()
    );

    return {
      appName: infoPlist.CFBundleDisplayName || infoPlist.CFBundleName || 'Unknown',
      bundleId: infoPlist.CFBundleIdentifier || 'Unknown',
      version: infoPlist.CFBundleShortVersionString || 'Unknown',
      buildNumber: infoPlist.CFBundleVersion || 'Unknown',
      minIOSVersion: infoPlist.MinimumOSVersion || 'Unknown',
      supportedDevices: infoPlist.UISupportedInterfaceOrientations || [],
      architectures: ['arm64', 'arm64e'], // Default for modern iOS
      entitlements,
      frameworks,
      codeSigningInfo: {
        teamId: 'N/A', // Would need code signature parsing
      },
      appSize,
      executable: Math.floor(appSize * 0.3), // Estimate
      assets: Math.floor(appSize * 0.7), // Estimate
    };
  } finally {
    // Cleanup
    rmSync(tmpDir, { recursive: true, force: true });
  }
}
