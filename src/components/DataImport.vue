<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title>Importação de Dados</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="selectedFile"
          label="Selecione o arquivo de dados"
          accept=".csv,.xlsx"
          show-size
          @change="handleFileChange"
        ></v-file-input>

        <v-select
          v-model="selectedDataType"
          :items="dataTypes"
          label="Tipo de Dados"
          item-title="text"
          item-value="value"
        ></v-select>

        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!selectedFile || !selectedDataType"
          @click="processData"
          block
        >
          Processar Dados
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row v-if="processedData.length > 0">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Dados Processados</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="processedData"
              :items-per-page="10"
            >
              <template v-slot:item.timestamp="{ item }">
                {{ formatDate(item.timestamp) }}
              </template>
              <template v-slot:item.value="{ item }">
                {{ formatNumber(item.value) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <data-export :data="processedData" />
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import { dataProcessingService } from '@/services/DataProcessingService'
import type { ProcessedDataPoint } from '@/types'
import DataExport from './DataExport.vue'

const selectedFile = ref<File | null>(null)
const selectedDataType = ref('')
const loading = ref(false)
const processedData = ref<ProcessedDataPoint[]>([])
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const dataTypes = [
  { text: 'Dados EPE', value: 'epe' },
  { text: 'Dados ANEEL', value: 'aneel' },
  { text: 'Dados Meteorológicos', value: 'meteo' },
  { text: 'Dados do Censo', value: 'censo' }
]

const headers = [
  { title: 'Data', key: 'timestamp' },
  { title: 'Valor', key: 'value' },
  { title: 'Categoria', key: 'category' },
  { title: 'Região', key: 'region' },
  { title: 'Fonte', key: 'source' }
]

const handleFileChange = (file: File | null) => {
  if (file) {
    selectedFile.value = file
  }
}

const showMessage = (text: string, color: string = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

const processData = async () => {
  if (!selectedFile.value || !selectedDataType.value) return

  loading.value = true
  try {
    const data = await dataProcessingService.processFile(
      selectedFile.value,
      selectedDataType.value
    )
    processedData.value = data
    showMessage('Dados processados com sucesso!')
  } catch (error) {
    console.error('Erro ao processar dados:', error)
    showMessage(error instanceof Error ? error.message : 'Erro ao processar dados', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd/MM/yyyy HH:mm')
  } catch {
    return date
  }
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
</style> 