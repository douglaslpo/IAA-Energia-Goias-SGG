import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './plugins/pinia'
import vuetify from './plugins/vuetify'
import { registerCharts } from './plugins/charts'

// Estilos globais
import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

registerCharts(app)

app.mount('#app') 