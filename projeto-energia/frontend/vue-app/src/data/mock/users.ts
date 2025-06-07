export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    role: 'data_scientist',
    department: 'Ciência de Dados',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@empresa.com',
    role: 'analyst',
    department: 'Engenharia de Energia',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Mariana Costa',
    email: 'mariana.costa@empresa.com',
    role: 'analyst',
    department: 'Análise de Negócios',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    role: 'frontend_dev',
    department: 'Desenvolvimento',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    name: 'Julia Pereira',
    email: 'julia.pereira@empresa.com',
    role: 'backend_dev',
    department: 'Desenvolvimento',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '6',
    name: 'Rafael Mendes',
    email: 'rafael.mendes@empresa.com',
    role: 'ux_designer',
    department: 'Design',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    id: '7',
    name: 'Admin',
    email: 'admin@empresa.com',
    role: 'admin',
    department: 'Administração',
    avatar: 'https://i.pravatar.cc/150?img=7'
  }
]; 