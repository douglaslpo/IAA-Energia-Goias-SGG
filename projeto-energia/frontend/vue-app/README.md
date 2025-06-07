# Sistema de Análise de Consumo Energético

Este é um sistema web desenvolvido em Vue.js para análise e monitoramento de consumo energético.

## Tecnologias Utilizadas

- Vue.js 3
- TypeScript
- Vuetify 3
- Pinia
- Vue Router
- Chart.js
- Axios
- SCSS

## Requisitos

- Node.js >= 18
- Yarn ou npm

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd projeto-energia/frontend/vue-app
```

2. Instale as dependências:
```bash
yarn install
# ou
npm install
```

3. Crie um arquivo `.env` baseado no `.env.example` e configure as variáveis de ambiente:
```bash
cp .env.example .env
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
yarn dev
# ou
npm run dev
```

O servidor será iniciado em `http://localhost:3000`.

## Build

Para gerar a build de produção:

```bash
yarn build
# ou
npm run build
```

## Estrutura do Projeto

```
src/
  ├── assets/         # Arquivos estáticos (imagens, estilos, etc.)
  ├── components/     # Componentes Vue reutilizáveis
  ├── plugins/        # Plugins Vue (Vuetify, Chart.js, etc.)
  ├── router/         # Configuração do Vue Router
  ├── services/       # Serviços e APIs
  ├── stores/         # Stores Pinia
  ├── types/          # Definições de tipos TypeScript
  ├── views/          # Componentes de página
  ├── App.vue         # Componente raiz
  └── main.ts         # Ponto de entrada da aplicação
```

## Funcionalidades

- Autenticação de usuários
- Dashboard com indicadores de consumo
- Gráficos de análise temporal
- Distribuição de consumo por setor
- Alertas e recomendações
- Tema claro/escuro
- Interface responsiva

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
