<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      location="left"
      v-if="isAuthenticated"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :elevation="1"
      color="primary"
      v-if="isAuthenticated"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>{{ appTitle }}</v-app-bar-title>
      <v-spacer />
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="d-flex justify-center">
      <span>&copy; {{ new Date().getFullYear() }} - Sistema de Análise de Consumo Energético</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const theme = useTheme()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const drawer = ref(true)
const appTitle = 'Sistema de Análise de Consumo Energético'

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
    title: 'Análises',
    path: '/analysis',
    icon: 'mdi-chart-line'
  },
  {
    title: 'Configurações',
    path: '/settings',
    icon: 'mdi-cog'
  }
]

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isDarkTheme = computed(() => settingsStore.theme === 'dark')

const toggleTheme = () => {
  const newTheme = !isDarkTheme.value
  settingsStore.alterarTema(newTheme)
  theme.global.name.value = newTheme ? 'dark' : 'light'
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  theme.global.name.value = settingsStore.theme
})
</script>

<style lang="scss">
@use '@/assets/styles/main.scss' as *;

.v-application {
  font-family: 'Roboto', sans-serif;
}

.v-main {
  background-color: rgb(var(--v-theme-background));
}

.v-footer {
  text-align: center;
  width: 100%;
}
</style> 