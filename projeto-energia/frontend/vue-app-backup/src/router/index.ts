import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { authGuard, roleGuard } from './middleware/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Início',
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      roles: ['admin', 'analyst']
    },
    beforeEnter: roleGuard(['admin', 'analyst'])
  },
  {
    path: '/data-lab',
    name: 'DataLab',
    component: () => import('@/views/DataLabView.vue'),
    meta: {
      title: 'Laboratório de Dados',
      requiresAuth: true,
      roles: ['data_scientist', 'analyst']
    },
    beforeEnter: roleGuard(['data_scientist', 'analyst'])
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('@/components/team/TeamDashboard.vue'),
    meta: {
      title: 'Equipe',
      requiresAuth: true,
      roles: ['admin', 'team_leader']
    },
    beforeEnter: roleGuard(['admin', 'team_leader'])
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('@/views/AnalysisView.vue'),
    meta: {
      title: 'Análises',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      title: 'Configurações',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/UnauthorizedView.vue'),
    meta: {
      title: 'Acesso Não Autorizado',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Página não encontrada',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Guarda de navegação global para autenticação
router.beforeEach(authGuard)

// Guarda de navegação para atualizar o título da página
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Sistema de Análise de Consumo Energético`
  next()
})

export default router 