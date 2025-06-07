import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { registerCharts } from './plugins/charts'
import { AuthService } from './services/AuthService'
import './assets/styles/main.scss'

const app = createApp(App)

// Inicializa o serviço de autenticação
AuthService.setupAxiosInterceptors()

// Plugins
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Registra componentes de gráficos
registerCharts(app)

// Configuração global
app.config.globalProperties.$filters = {
  formatDate: (value: string | Date) => {
    const date = new Date(value)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  },
  formatNumber: (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  },
  formatCurrency: (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
}

// Interceptor global para tratamento de erros
app.config.errorHandler = (err: Error, vm: any, info: string) => {
  console.error('Erro global:', err)
  console.error('Componente:', vm)
  console.error('Info:', info)
}

// Monta a aplicação
app.mount('#app') 