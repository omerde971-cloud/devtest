import { create } from 'zustand'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  login: (user: User, token: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  setToken: (token) => {
    set({ token })
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },

  login: (user, token, refreshToken) => {
    set({ user, token })
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
  },
}))
