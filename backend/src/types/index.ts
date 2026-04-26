// Auth types
export interface RegisterPayload {
  email: string;
  password: string;
  username?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username?: string;
  };
  token: string;
  refreshToken: string;
}

// Analysis types
export interface AnalysisReport {
  metadata: {
    appName: string;
    bundleId: string;
    version: string;
    minOS: string;
  };
  security: {
    riskLevel: 'low' | 'medium' | 'high';
    findings: string[];
  };
  dependencies: {
    frameworks: string[];
    libraries: string[];
  };
  size: {
    total: number;
    executable?: number;
    assets?: number;
  };
}

// IPA Analysis types
export interface IPAAnalysis {
  appName: string;
  bundleId: string;
  version: string;
  buildNumber: string;
  minIOSVersion: string;
  architectures: string[];
  entitlements: string[];
  frameworks: string[];
  codeSigningInfo: {
    teamId: string;
    certificateExpiry?: Date;
  };
  appSize: number;
}

// APK Analysis types
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
    receivers: string[];
    providers: string[];
  };
  libraries: string[];
  methodCount: number;
  apkSize: number;
  debuggable: boolean;
  backupAllowed: boolean;
}
