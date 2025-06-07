<template>
  <div class="recommendations">
    <v-timeline v-if="data.length > 0" density="compact" align="start">
      <v-timeline-item
        v-for="recommendation in sortedRecommendations"
        :key="recommendation.id"
        :dot-color="getDifficultyColor(recommendation.difficulty)"
        size="small"
      >
        <template v-slot:opposite>
          <div class="text-caption">
            Impacto: {{ formatNumber(recommendation.impact * 100) }}%
          </div>
        </template>
        <v-card>
          <v-card-title class="text-subtitle-1">
            {{ recommendation.title }}
            <v-chip
              :color="getDifficultyColor(recommendation.difficulty)"
              size="x-small"
              class="ml-2"
            >
              {{ getDifficultyLabel(recommendation.difficulty) }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <p>{{ recommendation.description }}</p>
            <v-chip-group class="mt-2">
              <v-chip size="small" color="primary">
                {{ recommendation.category }}
              </v-chip>
              <v-chip size="small" color="success">
                Economia: {{ formatCurrency(recommendation.savings_potential) }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-alert
      v-else
      type="info"
      text="Não há recomendações disponíveis no momento."
    ></v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Recommendation } from '@/types'

const props = defineProps<{
  data: Recommendation[]
}>()

const sortedRecommendations = computed(() => {
  return [...props.data].sort((a, b) => b.impact - a.impact)
})

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'low':
      return 'success'
    case 'medium':
      return 'warning'
    case 'high':
      return 'error'
    default:
      return 'grey'
  }
}

const getDifficultyLabel = (difficulty: string): string => {
  switch (difficulty) {
    case 'low':
      return 'Fácil'
    case 'medium':
      return 'Médio'
    case 'high':
      return 'Difícil'
    default:
      return 'N/A'
  }
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value)
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<style scoped>
.recommendations {
  max-height: 500px;
  overflow-y: auto;
}

.v-timeline-item {
  margin-bottom: 16px;
}

.v-card-title {
  font-size: 1rem !important;
  line-height: 1.4;
  padding: 12px 16px;
}

.v-card-text {
  padding-top: 8px;
}
</style> 