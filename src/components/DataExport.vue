<template>
  <v-card>
    <v-card-title>Exportar Dados</v-card-title>
    <v-card-text>
      <v-select
        v-model="selectedFormat"
        :items="exportFormats"
        label="Formato de Exportação"
        item-title="text"
        item-value="value"
      ></v-select>

      <v-text-field
        v-model="filename"
        :label="'Nome do arquivo' + getFileExtension"
        hide-details
        class="mb-4"
      ></v-text-field>

      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!selectedFormat || !data.length"
        @click="exportData"
        block
      >
        Exportar Dados
      </v-btn>
    </v-card-text>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { exportService } from '@/services/ExportService'
import type { ProcessedDataPoint } from '@/types'

const props = defineProps<{
  data: ProcessedDataPoint[]
}>()

const selectedFormat = ref('')
const filename = ref('')
const loading = ref(false)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const exportFormats = [
  { text: 'CSV', value: 'csv' },
  { text: 'Excel (XLSX)', value: 'xlsx' },
  { text: 'JSON', value: 'json' }
]

const getFileExtension = computed(() => {
  switch (selectedFormat.value) {
    case 'csv':
      return '.csv'
    case 'xlsx':
      return '.xlsx'
    case 'json':
      return '.json'
    default:
      return ''
  }
})

const showMessage = (text: string, color: string = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

const exportData = async () => {
  if (!selectedFormat.value || !props.data.length) return

  loading.value = true
  try {
    const fullFilename = `${filename.value || 'dados_consumo'}${getFileExtension.value}`

    switch (selectedFormat.value) {
      case 'csv':
        exportService.exportToCSV(props.data, fullFilename)
        break
      case 'xlsx':
        exportService.exportToXLSX(props.data, fullFilename)
        break
      case 'json':
        exportService.exportToJSON(props.data, fullFilename)
        break
    }

    showMessage('Dados exportados com sucesso!')
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    showMessage(error instanceof Error ? error.message : 'Erro ao exportar dados', 'error')
  } finally {
    loading.value = false
  }
}
</script> 