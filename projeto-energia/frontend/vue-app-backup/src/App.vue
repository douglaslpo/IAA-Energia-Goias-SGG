<template>
  <v-app>
    <!-- Barra de navegação -->
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Sistema de Análise de Consumo Energético</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="navigateTo('/settings')">
            <v-list-item-title>Configurações</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Menu lateral -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Conteúdo principal -->
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Snackbar para mensagens -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn
          color="white"
          text
          @click="snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

export default defineComponent({
  name: 'App',

  setup() {
    const router = useRouter();
    const theme = useTheme();
    const drawer = ref(false);

    const menuItems = [
      {
        title: 'Início',
        path: '/',
        icon: 'mdi-home'
      },
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: 'mdi-view-dashboard'
      },
      {
        title: 'Laboratório de Dados',
        path: '/data-lab',
        icon: 'mdi-flask'
      },
      {
        title: 'Equipe',
        path: '/team',
        icon: 'mdi-account-group'
      },
      {
        title: 'Análises',
        path: '/analysis',
        icon: 'mdi-chart-line'
      }
    ];

    const snackbar = ref({
      show: false,
      text: '',
      color: 'success',
      timeout: 3000
    });

    const isDarkTheme = computed(() => theme.global.current.value.dark);

    const toggleTheme = () => {
      theme.global.name.value = isDarkTheme.value ? 'light' : 'dark';
    };

    const navigateTo = (path: string) => {
      router.push(path);
    };

    const logout = () => {
      localStorage.removeItem('token');
      router.push('/login');
      showMessage('Sessão encerrada com sucesso', 'info');
    };

    const showMessage = (text: string, color = 'success') => {
      snackbar.value = {
        show: true,
        text,
        color,
        timeout: 3000
      };
    };

    return {
      drawer,
      menuItems,
      snackbar,
      isDarkTheme,
      toggleTheme,
      navigateTo,
      logout
    };
  }
});
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.v-main {
  background-color: var(--v-background-base);
}

.v-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: $spacing-md;

  @include respond-to(xs) {
    padding: $spacing-sm;
  }
}
</style> 