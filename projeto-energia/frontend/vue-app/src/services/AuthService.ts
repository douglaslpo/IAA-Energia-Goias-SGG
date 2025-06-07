import api from './api'
import type { LoginCredentials, AuthResponse, User } from '@/types'

class AuthService {
  private static instance: AuthService
  private user: User | null = null

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      this.user = response.data.user
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login')
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
      this.user = null
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer logout')
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await api.post('/auth/validate', { token })
      return response.data.valid
    } catch {
      return false
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.user) return this.user

    try {
      const response = await api.get<User>('/auth/me')
      this.user = response.data
      return this.user
    } catch {
      return null
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>('/auth/profile', data)
      this.user = response.data
      return this.user
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil')
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword
      })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao alterar senha')
    }
  }
}

export const authService = AuthService.getInstance() 