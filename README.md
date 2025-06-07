# Energy Analytics Dashboard

## Sobre o Projeto

O Energy Analytics Dashboard é uma aplicação para monitoramento e análise de consumo energético, que permite visualizar dados históricos, fazer previsões de consumo futuro e otimizar a eficiência energética.

## Novas Funcionalidades

### Editor de Modelos

O Editor de Modelos é uma nova funcionalidade que permite criar, editar e testar algoritmos personalizados para:
- Detecção de anomalias no consumo
- Previsão de consumo futuro
- Análise de eficiência energética
- Visualização de dados

### Explorador de Dados

O Explorador de Dados é uma ferramenta para visualização, análise e transformação dos dados de consumo energético:
- Visualize os conjuntos de dados disponíveis
- Realize análises exploratórias (EDA)
- Execute consultas SQL personalizadas
- Crie visualizações e gráficos
- Realize operações de ETL (Extração, Transformação e Carregamento)

## Como Iniciar a Aplicação

Para iniciar a aplicação, basta executar o script `start-app.sh`:

```bash
./start-app.sh
```

Este script irá:
1. Instalar as dependências necessárias (se ainda não estiverem instaladas)
2. Resolver problemas com o react-refresh
3. Configurar o ambiente
4. Iniciar a aplicação

## Acessando as Funcionalidades

Após iniciar a aplicação, você pode acessar:

### Editor de Modelos
- Através do menu de navegação, clicando na opção "Editor de Modelos"
- Acessando diretamente a URL: http://localhost:3000/model-editor

### Explorador de Dados
- Através do menu de navegação, clicando na opção "Explorador de Dados"
- Acessando diretamente a URL: http://localhost:3000/data-explorer

## Usando o Editor de Modelos

O Editor de Modelos permite:

- Selecionar modelos existentes na lista à esquerda
- Editar o código no editor central
- Executar o modelo para testar seu funcionamento
- Salvar suas alterações
- Importar e exportar modelos

## Usando o Explorador de Dados

O Explorador de Dados permite:

- Selecionar conjuntos de dados na lista à esquerda
- Visualizar os dados na aba "Dados"
- Consultar estatísticas resumidas na aba "Estatísticas"
- Criar visualizações na aba "Gráficos"
- Executar consultas SQL personalizadas na aba "Consulta"

## Requisitos do Sistema

- Node.js (v14 ou superior)
- npm (v6 ou superior)

## Problemas Conhecidos

Se você encontrar problemas relacionados ao "react-refresh", execute o script `start-app.sh` que resolve automaticamente esses problemas.

## Contato

Para mais informações ou suporte, entre em contato com a equipe de desenvolvimento. 