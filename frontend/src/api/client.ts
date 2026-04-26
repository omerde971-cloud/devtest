import axios, { AxiosInstance, AxiosError } from 'axios'
import { AuthResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async register(email: string, password: string, username?: string) {
    const { data } = await this.client.post<AuthResponse>('/auth/register', {
      email,
      password,
      username,
    })
    return data
  }

  async login(email: string, password: string) {
    const { data } = await this.client.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    return data
  }

  async logout() {
    await this.client.post('/auth/logout')
  }

  // Analysis endpoints
  async uploadAnalysis(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await this.client.post('/analyses/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }

  async getAnalyses(limit = 10, offset = 0) {
    const { data } = await this.client.get('/analyses', {
      params: { limit, offset },
    })
    return data
  }

  async getAnalysis(id: string) {
    const { data } = await this.client.get(`/analyses/${id}`)
    return data
  }

  async deleteAnalysis(id: string) {
    const { data } = await this.client.delete(`/analyses/${id}`)
    return data
  }
}

export const apiClient = new ApiClient()
