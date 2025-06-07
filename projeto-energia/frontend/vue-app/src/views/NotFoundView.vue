<template>
  <div class="not-found">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" class="text-center">
          <v-icon
            size="100"
            color="primary"
            class="mb-4"
          >
            mdi-alert-circle
          </v-icon>
          
          <h1 class="text-h2 mb-4">404</h1>
          <h2 class="text-h4 mb-6">Página não encontrada</h2>
          
          <p class="text-body-1 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>

          <v-btn
            color="primary"
            size="large"
            to="/"
          >
            Voltar para o Início
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFoundView'
})
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  background-color: var(--v-background);

  .text-h2 {
    color: var(--primary);
    font-weight: 700;
  }

  .text-h4 {
    color: var(--secondary);
    font-weight: 500;
  }
}
</style> 