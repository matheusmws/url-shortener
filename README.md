# URL Shortener API

## 📋 Descrição
Sistema de encurtamento de URLs desenvolvido em Node.js que permite criar links curtos para URLs longas. O sistema suporta usuários autenticados e não autenticados, com funcionalidades adicionais para usuários registrados.

## ✨ Funcionalidades
- Encurtamento de URLs para usuários autenticados e não autenticados
- Sistema de autenticação com JWT
- Rastreamento de cliques em URLs encurtadas
- Gerenciamento de URLs (listar, editar, deletar) para usuários autenticados
- Soft delete para todos os registros

## 🚀 Tecnologias Utilizadas
- Node.js (v18+)
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT para autenticação
- Docker e Docker Compose
- npm (v9 ou superior)
- Docker
- Kubernetes (kubectl)

## 📦 Pré-requisitos
- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- Git

## 🛠️ Instalação e Configuração

### 1. Clone o repositório 

### 2. Instale as Dependências
- npm install

### 3. Configure o ambiente
- cp .env.example .env

### 4. Execute o projeto (desenvolvimento)
- docker-compose up -d
- npm run dev


## Testes

Para executar os testes sem cobertura:
- npm run test

Para executar os testes com cobertura:
- npm run test:coverage -- --config=jest.config.js

## Kubernetes

Para subir a aplicação no kubernetes:
- npm run k8s:dev

O projeto estará disponível em:
- API Gateway: http://localhost:30080
- Health Check: http://localhost:30080/health

## 🔀 API Gateway (KrakenD)

### Configuração
O projeto utiliza KrakenD como API Gateway para:
- Roteamento de requisições
- Rate limiting
- Autenticação/Autorização
- CORS
- Métricas e logs
- Cache

### Endpoints do Gateway

Todos os endpoints da API são acessados através do gateway na porta 8080:

#### Autenticação
- POST `/api/auth/register` - Registro de usuário
- POST `/api/auth/login` - Login de usuário

#### URLs
- GET `/health` - API health check
- POST `/api/urls/shorten` - Criar URL curta
- GET `/api/urls/my-urls` - Listar URLs do usuário
- PUT `/api/urls/{shortCode}` - Atualizar URL
- DELETE `/api/urls/{shortCode}` - Remover URL
- GET `/r/{shortCode}` - Redirecionar para URL original

### Métricas do Gateway
As métricas do KrakenD estão disponíveis no endpoint:
- http://localhost:8090/stats