<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form ref="form" v-model="isValid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="credentials.email"
                :rules="emailRules"
                label="E-mail"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="credentials.password"
                :rules="passwordRules"
                label="Senha"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!isValid || loading"
              @click="handleLogin"
            >
              Entrar
            </v-btn>
          </v-card-actions>

          <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="3000"
          >
            {{ snackbar.text }}
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AuthService } from '@/services/AuthService';

export default defineComponent({
  name: 'LoginView',

  setup() {
    const router = useRouter();
    const route = useRoute();
    const form = ref<any>(null);
    const isValid = ref(false);
    const loading = ref(false);
    const showPassword = ref(false);

    const credentials = ref({
      email: '',
      password: ''
    });

    const snackbar = ref({
      show: false,
      text: '',
      color: 'error'
    });

    const emailRules = [
      (v: string) => !!v || 'E-mail é obrigatório',
      (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
    ];

    const passwordRules = [
      (v: string) => !!v || 'Senha é obrigatória',
      (v: string) => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres'
    ];

    const showError = (message: string) => {
      snackbar.value = {
        show: true,
        text: message,
        color: 'error'
      };
    };

    const handleLogin = async () => {
      if (!form.value?.validate()) return;

      loading.value = true;

      try {
        await AuthService.login(credentials.value);
        const redirectPath = route.query.redirect as string || '/';
        router.push(redirectPath);
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Erro ao fazer login');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      isValid,
      loading,
      showPassword,
      credentials,
      emailRules,
      passwordRules,
      snackbar,
      handleLogin
    };
  }
});
</script>

<style lang="scss" scoped>
.v-card {
  border-radius: $border-radius-lg;
}

.v-toolbar {
  border-top-left-radius: $border-radius-lg;
  border-top-right-radius: $border-radius-lg;
}
</style> 