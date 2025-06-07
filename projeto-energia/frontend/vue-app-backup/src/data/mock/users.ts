export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@exemplo.com',
    password: 'senha123',
    role: 'data_scientist'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@exemplo.com',
    password: 'senha123',
    role: 'energy_engineer'
  },
  {
    id: '3',
    name: 'Mariana Costa',
    email: 'mariana.costa@exemplo.com',
    password: 'senha123',
    role: 'business_analyst'
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@exemplo.com',
    password: 'senha123',
    role: 'frontend_dev'
  },
  {
    id: '5',
    name: 'Julia Pereira',
    email: 'julia.pereira@exemplo.com',
    password: 'senha123',
    role: 'backend_dev'
  },
  {
    id: '6',
    name: 'Rafael Mendes',
    email: 'rafael.mendes@exemplo.com',
    password: 'senha123',
    role: 'ux_designer'
  },
  {
    id: '7',
    name: 'Admin',
    email: 'admin@exemplo.com',
    password: 'admin123',
    role: 'admin'
  }
]; 