import { mockUsers, MockUser } from '@/data/mock/users';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'seu_secret_key_super_seguro';

export class MockAuthService {
  static async login(email: string, password: string): Promise<{ token: string; user: Omit<MockUser, 'password'> }> {
    // Simula delay da rede
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
      },
      JWT_SECRET
    );

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  }

  static verifyToken(token: string): boolean {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch {
      return false;
    }
  }

  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
} 