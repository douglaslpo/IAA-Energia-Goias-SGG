<template>
  <div class="data-lab">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              Laboratório de Dados
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="createNewAnalysis"
              >
                Nova Análise
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-tabs v-model="activeTab">
                <v-tab value="datasets">Datasets</v-tab>
                <v-tab value="analysis">Análises</v-tab>
                <v-tab value="models">Modelos</v-tab>
              </v-tabs>

              <v-window v-model="activeTab">
                <!-- Datasets -->
                <v-window-item value="datasets">
                  <v-table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Última Atualização</th>
                        <th>Registros</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dataset in datasets" :key="dataset.id">
                        <td>{{ dataset.name }}</td>
                        <td>{{ dataset.description }}</td>
                        <td>{{ formatDate(dataset.lastUpdated) }}</td>
                        <td>{{ dataset.rowCount }}</td>
                        <td>
                          <v-btn
                            icon="mdi-eye"
                            variant="text"
                            size="small"
                            @click="viewDataset(dataset)"
                          ></v-btn>
                          <v-btn
                            icon="mdi-pencil"
                            variant="text"
                            size="small"
                            @click="editDataset(dataset)"
                          ></v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>

                <!-- Análises -->
                <v-window-item value="analysis">
                  <v-row>
                    <v-col
                      v-for="analysis in analyses"
                      :key="analysis.id"
                      cols="12"
                      md="6"
                      lg="4"
                    >
                      <v-card>
                        <v-card-title>{{ analysis.name }}</v-card-title>
                        <v-card-text>
                          <p>{{ analysis.description }}</p>
                          <v-chip
                            :color="getStatusColor(analysis.status)"
                            class="mt-2"
                          >
                            {{ analysis.status }}
                          </v-chip>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn
                            variant="text"
                            @click="viewAnalysis(analysis)"
                          >
                            Ver Detalhes
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-window-item>

                <!-- Modelos -->
                <v-window-item value="models">
                  <v-row>
                    <v-col
                      v-for="model in models"
                      :key="model.id"
                      cols="12"
                      md="6"
                      lg="4"
                    >
                      <v-card>
                        <v-card-title>{{ model.name }}</v-card-title>
                        <v-card-text>
                          <p>Tipo: {{ model.type }}</p>
                          <p>Criado em: {{ formatDate(model.createdAt) }}</p>
                          <v-chip
                            :color="getStatusColor(model.status)"
                            class="mt-2"
                          >
                            {{ model.status }}
                          </v-chip>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn
                            variant="text"
                            @click="viewModel(model)"
                          >
                            Ver Detalhes
                          </v-btn>
                          <v-btn
                            variant="text"
                            color="error"
                            @click="deleteModel(model)"
                          >
                            Excluir
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Diálogo de Nova Análise -->
    <v-dialog v-model="showNewAnalysisDialog" max-width="600px">
      <v-card>
        <v-card-title>Nova Análise</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newAnalysis.name"
              label="Nome da Análise"
              required
            ></v-text-field>
            <v-textarea
              v-model="newAnalysis.description"
              label="Descrição"
            ></v-textarea>
            <v-select
              v-model="newAnalysis.datasetId"
              :items="datasets"
              item-title="name"
              item-value="id"
              label="Dataset"
              required
            ></v-select>
            <v-select
              v-model="newAnalysis.type"
              :items="analysisTypes"
              label="Tipo de Análise"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="saveNewAnalysis"
          >
            Criar
          </v-btn>
          <v-btn
            color="grey"
            variant="text"
            @click="showNewAnalysisDialog = false"
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
import { format } from 'date-fns';
import { dataLabService, modelService } from '@/api/services';
import type { Dataset, Model } from '@/types';

export default defineComponent({
  name: 'DataLabView',

  setup() {
    const activeTab = ref('datasets');
    const datasets = ref<Dataset[]>([]);
    const analyses = ref([]);
    const models = ref<Model[]>([]);
    const showNewAnalysisDialog = ref(false);
    const newAnalysis = ref({
      name: '',
      description: '',
      datasetId: '',
      type: ''
    });

    const analysisTypes = [
      { text: 'Regressão', value: 'regression' },
      { text: 'Classificação', value: 'classification' },
      { text: 'Clustering', value: 'clustering' }
    ];

    const loadData = async () => {
      try {
        const [datasetsData, modelsData] = await Promise.all([
          dataLabService.getDatasetInfo('all'),
          modelService.getModels()
        ]);
        
        datasets.value = datasetsData;
        models.value = modelsData;
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    const formatDate = (date: Date) => {
      return format(new Date(date), 'dd/MM/yyyy HH:mm');
    };

    const getStatusColor = (status: string) => {
      const colors = {
        training: 'warning',
        ready: 'success',
        failed: 'error'
      };
      return colors[status as keyof typeof colors] || 'grey';
    };

    const createNewAnalysis = () => {
      showNewAnalysisDialog.value = true;
    };

    const saveNewAnalysis = async () => {
      try {
        await dataLabService.runAnalysis(
          newAnalysis.value.datasetId,
          {
            type: newAnalysis.value.type,
            name: newAnalysis.value.name,
            description: newAnalysis.value.description
          }
        );
        showNewAnalysisDialog.value = false;
        await loadData();
      } catch (error) {
        console.error('Erro ao criar análise:', error);
      }
    };

    const viewDataset = (dataset: Dataset) => {
      // Implementar visualização detalhada do dataset
    };

    const editDataset = (dataset: Dataset) => {
      // Implementar edição do dataset
    };

    const viewAnalysis = (analysis: any) => {
      // Implementar visualização detalhada da análise
    };

    const viewModel = (model: Model) => {
      // Implementar visualização detalhada do modelo
    };

    const deleteModel = async (model: Model) => {
      // Implementar exclusão do modelo
    };

    onMounted(() => {
      loadData();
    });

    return {
      activeTab,
      datasets,
      analyses,
      models,
      showNewAnalysisDialog,
      newAnalysis,
      analysisTypes,
      formatDate,
      getStatusColor,
      createNewAnalysis,
      saveNewAnalysis,
      viewDataset,
      editDataset,
      viewAnalysis,
      viewModel,
      deleteModel
    };
  }
});
</script>

<style lang="scss" scoped>
.data-lab {
  .v-card {
    margin-bottom: 1rem;
  }

  .v-table {
    margin-top: 1rem;
  }

  .v-chip {
    margin-right: 0.5rem;
  }
}
</style> 