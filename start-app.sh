#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para exibir mensagens de status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Verifica se o Node.js está instalado
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado. Por favor, instale o Node.js"
        exit 1
    fi
    print_status "Node.js encontrado: $(node --version)"
}

# Verifica se o npm está instalado
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm não encontrado. Por favor, instale o npm"
        exit 1
    fi
    print_status "npm encontrado: $(npm --version)"
}

# Verifica e instala dependências
install_dependencies() {
    print_status "Verificando e instalando dependências..."
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules não encontrado. Instalando dependências..."
        npm install
    else
        print_status "Verificando por atualizações nas dependências..."
        npm install
    fi
}

# Configura variáveis de ambiente se necessário
setup_env() {
    if [ ! -f ".env" ]; then
        print_warning "Arquivo .env não encontrado. Criando arquivo .env padrão..."
        echo "VITE_APP_TITLE='Sistema de Análise de Consumo Energético'
VITE_APP_API_URL='http://localhost:3001/api'
VITE_APP_VERSION='1.0.0'" > .env
    fi
    print_status "Configuração de ambiente verificada"
}

# Limpa cache e arquivos temporários
clean_cache() {
    print_status "Limpando cache..."
    rm -rf .cache dist
    npm cache clean --force
}

# Inicia a aplicação
start_app() {
    print_status "Iniciando a aplicação..."
    if [ "$1" == "prod" ]; then
        npm run build && npm run preview
    else
        npm run dev
    fi
}

# Menu principal
main() {
    echo -e "\n${GREEN}=== Sistema de Análise de Consumo Energético ===${NC}"
    echo -e "Iniciando configuração do ambiente...\n"

    check_node
    check_npm
    install_dependencies
    setup_env
    
    echo -e "\n${GREEN}=== Ambiente configurado com sucesso ===${NC}"
    
    if [ "$1" == "clean" ]; then
        clean_cache
    fi
    
    start_app $2
}

# Executa o script
main "$@" 