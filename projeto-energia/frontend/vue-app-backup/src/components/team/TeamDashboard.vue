<template>
  <div class="team-dashboard">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">Dashboard da Equipe</h1>
        </v-col>
      </v-row>

      <!-- Membros da Equipe -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Equipe Multidisciplinar</v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="member in team"
                  :key="member.id"
                  cols="12"
                  md="4"
                >
                  <v-card>
                    <v-card-title>{{ member.name }}</v-card-title>
                    <v-card-subtitle>{{ getRoleLabel(member.role) }}</v-card-subtitle>
                    <v-card-text>
                      <v-chip
                        v-for="skill in member.expertise"
                        :key="skill"
                        class="ma-1"
                        color="primary"
                        variant="outlined"
                      >
                        {{ skill }}
                      </v-chip>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tarefas Ativas -->
      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex align-center">
              Tarefas Ativas
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="showNewTaskDialog = true"
              >
                Nova Tarefa
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Responsáveis</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in tasks" :key="task.id">
                    <td>{{ task.title }}</td>
                    <td>
                      <v-chip
                        v-for="memberId in task.assignedTo"
                        :key="memberId"
                        size="small"
                        class="ma-1"
                      >
                        {{ getTeamMemberName(memberId) }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip
                        :color="getStatusColor(task.status)"
                      >
                        {{ task.status }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip
                        :color="getPriorityColor(task.priority)"
                      >
                        {{ task.priority }}
                      </v-chip>
                    </td>
                    <td>
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        @click="editTask(task)"
                      ></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Revisões Pendentes -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Revisões Pendentes</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="review in pendingReviews"
                  :key="review.analysisId"
                >
                  <v-list-item-title>
                    Análise: {{ review.analysisId }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Revisor: {{ getTeamMemberName(review.reviewerId) }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-btn
                      color="primary"
                      variant="text"
                      @click="openReview(review)"
                    >
                      Revisar
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Diálogo de Nova Tarefa -->
    <v-dialog v-model="showNewTaskDialog" max-width="600px">
      <v-card>
        <v-card-title>Nova Tarefa</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newTask.title"
              label="Título"
              required
            ></v-text-field>
            <v-textarea
              v-model="newTask.description"
              label="Descrição"
            ></v-textarea>
            <v-select
              v-model="newTask.assignedTo"
              :items="team"
              item-title="name"
              item-value="id"
              label="Responsáveis"
              multiple
              chips
            ></v-select>
            <v-select
              v-model="newTask.priority"
              :items="priorities"
              label="Prioridade"
            ></v-select>
            <v-text-field
              v-model="newTask.dueDate"
              label="Data de Entrega"
              type="date"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="saveNewTask"
          >
            Criar
          </v-btn>
          <v-btn
            color="grey"
            variant="text"
            @click="showNewTaskDialog = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { teamCollaborationService } from '@/services/TeamCollaborationService';
import type { TeamMember, CollaborationTask, AnalysisReview } from '@/services/TeamCollaborationService';

export default defineComponent({
  name: 'TeamDashboard',

  setup() {
    const team = ref<TeamMember[]>([]);
    const tasks = ref<CollaborationTask[]>([]);
    const pendingReviews = ref<AnalysisReview[]>([]);
    const showNewTaskDialog = ref(false);

    const newTask = ref({
      title: '',
      description: '',
      assignedTo: [] as string[],
      priority: 'medium' as const,
      dueDate: '',
      tags: []
    });

    const priorities = [
      { text: 'Baixa', value: 'low' },
      { text: 'Média', value: 'medium' },
      { text: 'Alta', value: 'high' }
    ];

    const loadData = async () => {
      team.value = Object.values(teamCollaborationService.getTeamMembersByRole('data_scientist'))
        .concat(teamCollaborationService.getTeamMembersByRole('energy_engineer'))
        .concat(teamCollaborationService.getTeamMembersByRole('business_analyst'))
        .concat(teamCollaborationService.getTeamMembersByRole('frontend_dev'))
        .concat(teamCollaborationService.getTeamMembersByRole('backend_dev'))
        .concat(teamCollaborationService.getTeamMembersByRole('ux_designer'));

      tasks.value = teamCollaborationService.getTasks();
      pendingReviews.value = teamCollaborationService.getPendingReviews();
    };

    const getRoleLabel = (role: TeamMember['role']): string => {
      const labels = {
        data_scientist: 'Cientista de Dados',
        energy_engineer: 'Engenheiro de Energia',
        business_analyst: 'Analista de Negócios',
        frontend_dev: 'Desenvolvedor Frontend',
        backend_dev: 'Desenvolvedor Backend',
        ux_designer: 'Designer UX/UI'
      };
      return labels[role];
    };

    const getStatusColor = (status: CollaborationTask['status']): string => {
      const colors = {
        todo: 'grey',
        in_progress: 'blue',
        review: 'orange',
        done: 'green'
      };
      return colors[status];
    };

    const getPriorityColor = (priority: CollaborationTask['priority']): string => {
      const colors = {
        low: 'green',
        medium: 'orange',
        high: 'red'
      };
      return colors[priority];
    };

    const getTeamMemberName = (id: string): string => {
      const member = team.value.find(m => m.id === id);
      return member ? member.name : 'Não encontrado';
    };

    const saveNewTask = async () => {
      await teamCollaborationService.createTask({
        ...newTask.value,
        status: 'todo',
        tags: []
      });
      showNewTaskDialog.value = false;
      await loadData();
    };

    const editTask = (task: CollaborationTask) => {
      // Implementar edição de tarefa
    };

    const openReview = (review: AnalysisReview) => {
      // Implementar abertura de revisão
    };

    onMounted(() => {
      loadData();
    });

    return {
      team,
      tasks,
      pendingReviews,
      showNewTaskDialog,
      newTask,
      priorities,
      getRoleLabel,
      getStatusColor,
      getPriorityColor,
      getTeamMemberName,
      saveNewTask,
      editTask,
      openReview
    };
  }
});
</script>

<style lang="scss" scoped>
.team-dashboard {
  .v-card {
    margin-bottom: 1rem;
  }

  .v-chip {
    margin-right: 0.25rem;
  }
}
</style> 