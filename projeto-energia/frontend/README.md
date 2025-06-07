# Frontend - Interfaces

## Estrutura
```
frontend/
├── react-app/           # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes React reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── services/      # Serviços e chamadas API
│   │   ├── store/         # Gerenciamento de estado
│   │   ├── styles/        # Estilos e temas
│   │   ├── types/         # Tipos TypeScript
│   │   └── utils/         # Funções utilitárias
│   └── tests/            # Testes
│
├── vue-app/            # Aplicação Vue
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── composables/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   └── tests/
```

## Setup React
1. Entre no diretório:
```bash
cd react-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

## Setup Vue
1. Entre no diretório:
```bash
cd vue-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

## Scripts Disponíveis

### React
- `npm start` - Inicia o servidor de desenvolvimento
- `npm test` - Executa os testes
- `npm run build` - Gera build de produção

### Vue
- `npm run serve` - Inicia o servidor de desenvolvimento
- `npm run test:unit` - Executa os testes unitários
- `npm run build` - Gera build de produção

## Componentes Principais
- Dashboard de Energia
- Gráficos de Consumo
- Previsões e Análises
- Configurações do Sistema

## Desenvolvimento
- Siga o guia de estilo em `docs/frontend/style-guide.md`
- Use componentes dos diretórios `components/common`
- Mantenha os tipos atualizados em `types/` 