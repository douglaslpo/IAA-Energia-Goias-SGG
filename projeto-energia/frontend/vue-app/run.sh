#!/bin/bash

echo "🚀 Iniciando o Sistema de Análise de Consumo Energético..."

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js (versão >= 18)"
    exit 1
fi

# Verifica a versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
if (( ${NODE_VERSION%%.*} < 18 )); then
    echo "❌ É necessário Node.js versão 18 ou superior. Versão atual: $NODE_VERSION"
    exit 1
fi

# Verifica se o yarn está instalado
if ! command -v yarn &> /dev/null; then
    echo "⚙️ Yarn não encontrado. Instalando..."
    npm install -g yarn
fi

# Instala as dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    yarn install
fi

# Inicia a aplicação
echo "🌐 Iniciando o servidor de desenvolvimento..."
yarn dev 