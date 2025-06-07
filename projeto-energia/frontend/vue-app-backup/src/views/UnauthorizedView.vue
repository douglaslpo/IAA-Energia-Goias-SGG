<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-icon
          size="100"
          color="error"
          class="mb-4"
        >
          mdi-alert-circle
        </v-icon>
        
        <h1 class="text-h3 mb-6">Acesso Não Autorizado</h1>
        
        <p class="text-body-1 mb-6">
          Você não tem permissão para acessar esta página.
          Entre em contato com o administrador do sistema se acredita que isso é um erro.
        </p>

        <v-btn
          color="primary"
          size="large"
          @click="goBack"
        >
          Voltar
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'UnauthorizedView',

  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    return {
      goBack
    };
  }
});
</script>

<style lang="scss" scoped>
.v-container {
  background-color: var(--v-background-base);
}

.text-h3 {
  color: var(--v-error-base);
}
</style> 