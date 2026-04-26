import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const store = useAuthStore()

  return {
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: !!store.token,
    login: store.login,
    logout: store.logout,
    setLoading: store.setLoading,
    setError: store.setError,
  }
}
