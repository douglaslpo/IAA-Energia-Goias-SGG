<template>
  <div class="settings">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Configurações</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Perfil do Usuário</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="salvarPerfil" ref="formPerfil">
              <v-text-field
                v-model="perfil.nome"
                label="Nome"
                required
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="perfil.email"
                label="E-mail"
                type="email"
                required
                :rules="[rules.required, rules.email]"
              />

              <v-text-field
                v-model="perfil.cargo"
                label="Cargo"
                required
                :rules="[rules.required]"
              />

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading.perfil"
                class="mt-4"
              >
                Salvar Alterações
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>Alterar Senha</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="alterarSenha" ref="formSenha">
              <v-text-field
                v-model="senha.atual"
                label="Senha Atual"
                type="password"
                required
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="senha.nova"
                label="Nova Senha"
                type="password"
                required
                :rules="[rules.required, rules.min]"
              />

              <v-text-field
                v-model="senha.confirmacao"
                label="Confirmar Nova Senha"
                type="password"
                required
                :rules="[rules.required, rules.senhaMatch]"
              />

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading.senha"
                class="mt-4"
              >
                Alterar Senha
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Preferências do Sistema</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Tema</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="preferencias.tema"
                    :label="preferencias.tema ? 'Escuro' : 'Claro'"
                    hide-details
                    @change="alterarTema"
                  />
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Notificações</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="preferencias.notificacoes"
                    label="Ativar"
                    hide-details
                    @change="alterarNotificacoes"
                  />
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Idioma</v-list-item-title>
                <template v-slot:append>
                  <v-select
                    v-model="preferencias.idioma"
                    :items="idiomas"
                    density="compact"
                    hide-details
                    @update:model-value="alterarIdioma"
                  />
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Unidade de Energia</v-list-item-title>
                <template v-slot:append>
                  <v-select
                    v-model="preferencias.unidadeEnergia"
                    :items="unidadesEnergia"
                    density="compact"
                    hide-details
                    @update:model-value="alterarUnidadeEnergia"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>Alertas e Notificações</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="alerta in alertas"
                :key="alerta.id"
              >
                <v-list-item-title>{{ alerta.titulo }}</v-list-item-title>
                <v-list-item-subtitle>{{ alerta.descricao }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="alerta.ativo"
                    hide-details
                    @change="alterarAlerta(alerta)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const formPerfil = ref<any>(null)
const formSenha = ref<any>(null)

const loading = ref({
  perfil: false,
  senha: false
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const perfil = ref({
  nome: 'João Silva',
  email: 'joao.silva@empresa.com',
  cargo: 'Gerente de Energia'
})

const senha = ref({
  atual: '',
  nova: '',
  confirmacao: ''
})

const preferencias = ref({
  tema: theme.global.current.value.dark,
  notificacoes: true,
  idioma: 'pt-BR',
  unidadeEnergia: 'kWh'
})

const idiomas = [
  { title: 'Português', value: 'pt-BR' },
  { title: 'English', value: 'en-US' },
  { title: 'Español', value: 'es-ES' }
]

const unidadesEnergia = [
  { title: 'Quilowatt-hora (kWh)', value: 'kWh' },
  { title: 'Megawatt-hora (MWh)', value: 'MWh' },
  { title: 'Joules (J)', value: 'J' }
]

const alertas = ref([
  {
    id: 1,
    titulo: 'Consumo Elevado',
    descricao: 'Notificar quando o consumo ultrapassar a média',
    ativo: true
  },
  {
    id: 2,
    titulo: 'Manutenção Preventiva',
    descricao: 'Alertar sobre necessidade de manutenção',
    ativo: true
  },
  {
    id: 3,
    titulo: 'Relatórios Semanais',
    descricao: 'Enviar relatório semanal por e-mail',
    ativo: false
  }
])

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  min: (v: string) => v.length >= 6 || 'Mínimo de 6 caracteres',
  senhaMatch: (v: string) => v === senha.value.nova || 'As senhas não conferem'
}

const showMessage = (text: string, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

const salvarPerfil = async () => {
  const isValid = await formPerfil.value?.validate()
  if (!isValid) return

  loading.value.perfil = true
  try {
    // Implementar lógica de salvamento
    showMessage('Perfil atualizado com sucesso')
  } catch (error) {
    showMessage('Erro ao atualizar perfil', 'error')
  } finally {
    loading.value.perfil = false
  }
}

const alterarSenha = async () => {
  const isValid = await formSenha.value?.validate()
  if (!isValid) return

  loading.value.senha = true
  try {
    // Implementar lógica de alteração de senha
    showMessage('Senha alterada com sucesso')
    senha.value = {
      atual: '',
      nova: '',
      confirmacao: ''
    }
  } catch (error) {
    showMessage('Erro ao alterar senha', 'error')
  } finally {
    loading.value.senha = false
  }
}

const alterarTema = () => {
  theme.global.name.value = preferencias.value.tema ? 'dark' : 'light'
  showMessage('Tema alterado com sucesso')
}

const alterarNotificacoes = () => {
  // Implementar lógica de notificações
  showMessage('Preferências de notificação atualizadas')
}

const alterarIdioma = () => {
  // Implementar lógica de idioma
  showMessage('Idioma alterado com sucesso')
}

const alterarUnidadeEnergia = () => {
  // Implementar lógica de unidade de energia
  showMessage('Unidade de energia alterada com sucesso')
}

const alterarAlerta = (alerta: any) => {
  // Implementar lógica de alteração de alerta
  showMessage(`Alerta "${alerta.titulo}" ${alerta.ativo ? 'ativado' : 'desativado'}`)
}
</script>

<style lang="scss" scoped>
.settings {
  padding: var(--spacing-md);

  .v-card {
    border-radius: var(--border-radius-md);
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .text-h3 {
    color: var(--primary);
    font-weight: 500;
  }
}
</style> 