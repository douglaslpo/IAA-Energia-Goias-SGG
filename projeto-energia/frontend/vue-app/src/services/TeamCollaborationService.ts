import { ref } from 'vue';
import type { AnalysisResult, ValidationError } from '@/types/data';
import { mockUsers } from '@/data/mock/users'

export interface TeamMember {
  id: string;
  name: string;
  role: 'data_scientist' | 'energy_engineer' | 'business_analyst' | 'frontend_dev' | 'backend_dev' | 'ux_designer';
  expertise: string[];
  department: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
}

export interface AnalysisReview {
  analysisId: string;
  reviewerId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  suggestions?: string[];
  timestamp: Date;
}

export interface CollaborationTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
}

interface TeamActivity {
  id: string;
  userId: string;
  type: 'comment' | 'analysis' | 'report' | 'alert';
  description: string;
  timestamp: string;
}

interface TeamMetrics {
  totalMembers: number;
  activeProjects: number;
  completedAnalyses: number;
  pendingTasks: number;
}

class TeamCollaborationService {
  private readonly team: TeamMember[] = [
    {
      id: 'ds_1',
      name: 'Ana Silva',
      role: 'data_scientist',
      expertise: ['machine_learning', 'statistical_analysis', 'python', 'r'],
      department: 'Data Science',
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString()
    },
    {
      id: 'ee_1',
      name: 'Carlos Santos',
      role: 'energy_engineer',
      expertise: ['power_systems', 'energy_efficiency', 'regulatory'],
      department: 'Energy Engineering',
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString()
    },
    {
      id: 'ba_1',
      name: 'Mariana Costa',
      role: 'business_analyst',
      expertise: ['requirements', 'process_modeling', 'stakeholder_management'],
      department: 'Business Analysis',
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString()
    },
    {
      id: 'fd_1',
      name: 'Pedro Oliveira',
      role: 'frontend_dev',
      expertise: ['vue', 'typescript', 'data_visualization'],
      department: 'Frontend Development',
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString()
    },
    {
      id: 'bd_1',
      name: 'Julia Pereira',
      role: 'backend_dev',
      expertise: ['python', 'fastapi', 'databases'],
      department: 'Backend Development',
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString()
    },
    {
      id: 'ux_1',
      name: 'Rafael Mendes',
      role: 'ux_designer',
      expertise: ['ui_design', 'user_research', 'prototyping'],
      department: 'UX Design',
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString()
    }
  ];

  private tasks = ref<CollaborationTask[]>([]);
  private reviews = ref<AnalysisReview[]>([]);

  /**
   * Solicita revisão de uma análise pela equipe
   * @param analysis Resultado da análise para revisão
   * @param requiredRoles Papéis necessários para a revisão
   * @returns IDs dos revisores designados
   */
  async requestAnalysisReview(
    analysis: AnalysisResult,
    requiredRoles: TeamMember['role'][]
  ): Promise<string[]> {
    const reviewers = this.team
      .filter(member => requiredRoles.includes(member.role))
      .map(member => member.id);

    const newReviews = reviewers.map(reviewerId => ({
      analysisId: analysis.dataset,
      reviewerId,
      status: 'pending' as const,
      comments: '',
      timestamp: new Date()
    }));

    this.reviews.value.push(...newReviews);
    return reviewers;
  }

  /**
   * Cria uma nova tarefa de colaboração
   * @param task Detalhes da tarefa
   */
  async createTask(task: Omit<CollaborationTask, 'id'>): Promise<CollaborationTask> {
    const newTask: CollaborationTask = {
      ...task,
      id: `task_${Date.now()}`,
      status: 'todo'
    };

    this.tasks.value.push(newTask);
    return newTask;
  }

  /**
   * Atualiza o status de uma tarefa
   * @param taskId ID da tarefa
   * @param status Novo status
   */
  async updateTaskStatus(taskId: string, status: CollaborationTask['status']): Promise<void> {
    const task = this.tasks.value.find(t => t.id === taskId);
    if (task) {
      task.status = status;
    }
  }

  /**
   * Obtém membros da equipe por papel
   * @param role Papel desejado
   * @returns Lista de membros
   */
  getTeamMembersByRole(role: TeamMember['role']): TeamMember[] {
    return this.team.filter(member => member.role === role);
  }

  /**
   * Valida uma análise com a equipe apropriada
   * @param analysis Resultado da análise
   * @returns Erros de validação, se houver
   */
  async validateAnalysis(analysis: AnalysisResult): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    
    // Validação do Cientista de Dados
    const dataScientist = this.getTeamMembersByRole('data_scientist')[0];
    if (analysis.metrics.standardDeviation > 100) {
      errors.push({
        field: 'metrics.standardDeviation',
        type: 'range',
        message: 'Desvio padrão muito alto, verificar outliers',
        value: analysis.metrics.standardDeviation
      });
    }

    // Validação do Engenheiro de Energia
    const energyEngineer = this.getTeamMembersByRole('energy_engineer')[0];
    if (analysis.metrics.average > 10000) {
      errors.push({
        field: 'metrics.average',
        type: 'range',
        message: 'Consumo médio acima do esperado, verificar medições',
        value: analysis.metrics.average
      });
    }

    return errors;
  }

  /**
   * Obtém todas as tarefas ativas
   * @returns Lista de tarefas
   */
  getTasks(): CollaborationTask[] {
    return this.tasks.value;
  }

  /**
   * Obtém todas as revisões pendentes
   * @returns Lista de revisões
   */
  getPendingReviews(): AnalysisReview[] {
    return this.reviews.value.filter(review => review.status === 'pending');
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    return mockUsers.map(user => ({
      ...user,
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString()
    }))
  }

  async getTeamActivities(): Promise<TeamActivity[]> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const activities: TeamActivity[] = [
      {
        id: '1',
        userId: '1',
        type: 'analysis',
        description: 'Análise de consumo do setor industrial concluída',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        userId: '2',
        type: 'comment',
        description: 'Comentário sobre otimização de consumo',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        userId: '3',
        type: 'report',
        description: 'Relatório mensal gerado',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ]

    return activities
  }

  async getTeamMetrics(): Promise<TeamMetrics> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      totalMembers: mockUsers.length,
      activeProjects: 5,
      completedAnalyses: 12,
      pendingTasks: 8
    }
  }

  async assignTask(userId: string, taskDescription: string): Promise<void> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Tarefa "${taskDescription}" atribuída ao usuário ${userId}`)
  }

  async sendMessage(userId: string, message: string): Promise<void> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Mensagem enviada para ${userId}: ${message}`)
  }
}

export const teamCollaborationService = new TeamCollaborationService(); 