<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Importação de Dados</h1>
        <v-card class="mb-4">
          <v-card-text>
            <p>Esta seção permite importar e processar diferentes tipos de dados:</p>
            <v-list>
              <v-list-item>
                <v-list-item-title>Dados EPE</v-list-item-title>
                <v-list-item-subtitle>
                  Dados de consumo energético da Empresa de Pesquisa Energética
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Dados ANEEL</v-list-item-title>
                <v-list-item-subtitle>
                  Dados de consumo energético da Agência Nacional de Energia Elétrica
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Dados Meteorológicos</v-list-item-title>
                <v-list-item-subtitle>
                  Dados meteorológicos do INMET para análise de correlação com consumo
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Dados do Censo</v-list-item-title>
                <v-list-item-subtitle>
                  Dados demográficos do IBGE para análise de fatores socioeconômicos
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <h3 class="text-h6 mb-2">Formatos Suportados</h3>
            <v-chip-group>
              <v-chip color="primary">CSV</v-chip>
              <v-chip color="primary">XLSX</v-chip>
            </v-chip-group>

            <h3 class="text-h6 mb-2 mt-4">Instruções</h3>
            <ol>
              <li>Selecione o tipo de dados que deseja importar</li>
              <li>Escolha o arquivo no formato CSV ou XLSX</li>
              <li>Clique em "Processar Dados" para iniciar a importação</li>
              <li>Verifique os dados processados na tabela</li>
              <li>Use as opções de exportação para salvar os dados em diferentes formatos</li>
            </ol>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <DataImport />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import DataImport from '@/components/DataImport.vue'
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}

ol {
  margin-left: 20px;
  margin-top: 10px;
}

li {
  margin-bottom: 8px;
}
</style> 