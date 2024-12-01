# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.2.0] - 2024-11-27
### Adicionado
- Implementação do KrakenD como API Gateway
- Sistema de observabilidade com Winston, Prometheus e OpenTelemetry
- DTOs para validação e transformação de dados
- Documentação Swagger/OpenAPI
- Healthcheck para o banco de dados PostgreSQL

### Alterado
- Atualização da versão do PostgreSQL para 14
- Reestruturação da arquitetura para usar API Gateway
- Melhoria no sistema de logs
- Refinamento das configurações do Docker

### Corrigido
- Problema de conexão com o banco de dados
- Conflito de portas no desenvolvimento local
- Incompatibilidade de versões do PostgreSQL

## [0.1.0] - 2024-11-26
### Adicionado
- Estrutura inicial do projeto
- Sistema de autenticação com JWT
- CRUD de URLs curtas
- Integração com PostgreSQL
- Configuração inicial do Docker
- Sistema básico de redirecionamento
- Middlewares de autenticação
- Validações básicas
- Configuração inicial do ambiente de desenvolvimento

### Segurança
- Implementação de autenticação JWT
- Validação de dados de entrada
- Proteção contra acessos não autorizados

[0.2.0]: https://github.com/seu-usuario/seu-repo/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/seu-usuario/seu-repo/releases/tag/v0.1.0 