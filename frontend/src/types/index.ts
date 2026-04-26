// Auth
export interface User {
  id: string
  email: string
  username?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// Analysis
export interface Analysis {
  id: string
  fileName: string
  fileSize: number
  format: 'ipa' | 'apk' | 'aab' | 'dsym' | 'xcarchive' | 'app'
  platform: 'ios' | 'android'
  status: 'queued' | 'processing' | 'completed' | 'failed'
  healthScore?: number
  reportData?: any
  createdAt: string
  completedAt?: string
}

// API Error
export interface ApiError {
  error: {
    status: number
    message: string
    code: string
  }
}
