#!/bin/bash

echo "Iniciando migração para nova estrutura..."

# Criar diretórios necessários
mkdir -p projeto-energia/{backend,frontend,monitoring,docs}

# Mover arquivos Python
echo "Movendo arquivos Python..."
find . -name "*.py" -not -path "./projeto-energia/*" -exec mv {} projeto-energia/backend/app/ \;

# Mover arquivos React/TypeScript
echo "Movendo arquivos React/TypeScript..."
find . -name "*.tsx" -o -name "*.ts" -not -path "./projeto-energia/*" -exec mv {} projeto-energia/frontend/src/ \;

# Mover arquivos de configuração
echo "Movendo arquivos de configuração..."
mv tsconfig.json projeto-energia/frontend/
mv package.json projeto-energia/frontend/
mv jest.config.js projeto-energia/frontend/

# Mover arquivos de estilo
echo "Movendo arquivos de estilo..."
find . -name "*.css" -o -name "*.scss" -not -path "./projeto-energia/*" -exec mv {} projeto-energia/frontend/src/styles/ \;

# Mover arquivos de teste
echo "Movendo arquivos de teste..."
find . -name "*.test.ts" -o -name "*.test.tsx" -not -path "./projeto-energia/*" -exec mv {} projeto-energia/frontend/tests/ \;

echo "Migração concluída!" 