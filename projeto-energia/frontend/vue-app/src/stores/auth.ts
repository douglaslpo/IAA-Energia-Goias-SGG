import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/AuthService'
import type { LoginCredentials, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer login'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await authService.logout()
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer logout'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const isValid = await authService.validateToken(token.value)
      if (!isValid) {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
      }
      return isValid
    } catch {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      return false
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}) 