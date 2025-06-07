# Backend - API e Serviços

## Estrutura
```
backend/
├── app/
│   ├── api/           # Endpoints e controllers
│   ├── core/          # Configurações e utilitários
│   ├── data_engineering/  # Processamento de dados
│   └── ml/            # Modelos de Machine Learning
└── tests/             # Testes unitários e integração
```

## Setup
1. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

## Desenvolvimento
- Execute `python -m pytest` para rodar os testes
- Use `python run.py` para iniciar o servidor em modo desenvolvimento

## API Endpoints
- `/api/v1/predictions` - Previsões de consumo
- `/api/v1/metrics` - Métricas de energia
- `/api/v1/analysis` - Análises detalhadas 