import axios, { InternalAxiosRequestConfig } from 'axios';
import { MockAuthService } from './MockAuthService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';
  private static readonly API_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';
  private static readonly USE_MOCK = process.env.NODE_ENV === 'development';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      if (this.USE_MOCK) {
        return await MockAuthService.login(credentials.email, credentials.password);
      }

      const response = await axios.post(`${this.API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      this.setToken(token);
      this.setUser(user);
      
      return response.data;
    } catch (error) {
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      if (this.USE_MOCK) {
        return MockAuthService.verifyToken(token);
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  static getUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private static setUser(user: AuthResponse['user']): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static setupAxiosInterceptors(): void {
    axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
} 