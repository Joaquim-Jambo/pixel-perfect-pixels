# Funcionalidades do Backend (API Endpoints)

Este documento lista todas as funcionalidades (endpoints) que já foram implementadas no backend e estão prontas para serem integradas na aplicação Frontend.

## 1. Autenticação (Auth)
Estas rotas gerenciam o acesso do usuário à plataforma, utilizando tokens JWT e Cookies.

- **Login** (`POST /auth/login`)
  - **Corpo da requisição:** `email`, `password`
  - **Ação:** Autentica o usuário, retorna o `access_token` e define o `refreshToken` num cookie `httpOnly` seguro.

- **Registo** (`POST /auth/register`)
  - **Corpo da requisição:** `name`, `email`, `passwordHash` (a senha do usuário)
  - **Ação:** Cria uma nova conta de usuário.

- **Logout** (`POST /auth/logout`)
  - **Ação:** Invalida a sessão do usuário e limpa o cookie `refreshToken`.

- **Refresh Token** (`POST /auth/refresh`)
  - **Ação:** Gera um novo `access_token` utilizando o cookie `refreshToken` atual.

---

## 2. Usuários (Users)
Gestão do perfil do usuário logado.

- **Obter Perfil Atual** (`GET /users/me`)
  - **Ação:** Retorna as informações do usuário atualmente logado (baseado no cookie).

- **Atualizar Perfil** (`PATCH /users/me`)
  - **Corpo da requisição:** Dados do usuário a serem atualizados (ex: nome, email).
  - **Ação:** Atualiza as informações básicas do perfil logado.

- **Atualizar Avatar** (`PATCH /users/me/avatar`)
  - **Formato:** `multipart/form-data`
  - **Corpo da requisição:** Ficheiro de imagem enviado no campo `file`.
  - **Ação:** Faz o upload e atualiza a imagem de perfil (avatar) do usuário.

---

## 3. Equipas (Teams)
Gestão das equipas de futebol do sistema.

- **Criar Equipa** (`POST /teams`)
  - **Cabeçalhos:** Requer Autenticação (Access Token JWT).
  - **Corpo da requisição:** Dados da equipa (nome, etc).
  - **Ação:** Cria uma nova equipa e associa-a ao usuário autenticado (que se torna o criador/capitão).

- **Listar Todas as Equipas** (`GET /teams`)
  - **Ação:** Retorna a lista de todas as equipas registadas na plataforma.

- **Obter Equipa por ID** (`GET /teams/:id`)
  - **Parâmetros de URL:** `id` da equipa.
  - **Ação:** Retorna os detalhes de uma equipa específica.

- **Atualizar Equipa** (`PATCH /teams/:id`)
  - **Parâmetros de URL:** `id` da equipa.
  - **Corpo da requisição:** Dados da equipa a atualizar.
  - **Ação:** Modifica os dados de uma equipa existente.

- **Atualizar Emblema da Equipa** (`PATCH /teams/:id/emblem`)
  - **Parâmetros de URL:** `id` da equipa.
  - **Formato:** `multipart/form-data`
  - **Corpo da requisição:** Ficheiro de imagem enviado no campo `file`.
  - **Ação:** Faz o upload e atualiza o emblema/logo da equipa.

- **Remover Equipa** (`DELETE /teams/:id`)
  - **Parâmetros de URL:** `id` da equipa.
  - **Ação:** Exclui uma equipa do sistema.

---

## 4. Desafios (Challenges)
Gestão dos jogos/desafios entre as equipas.

- **Criar Desafio** (`POST /challenges`)
  - **Corpo da requisição:** Dados do desafio (título, descrição, tipo de jogo, etc).
  - **Ação:** Cria um novo desafio. Nota: Identifica a equipa criadora através do cookie `refreshToken`.

- **Feed de Desafios** (`GET /challenges/feed`)
  - **Cabeçalhos:** Requer Autenticação (Access Token JWT).
  - **Parâmetros de Query (Opcionais):** `province`, `gameType`, `scheduledAt`.
  - **Ação:** Retorna o feed de desafios disponíveis, aplicando filtros de pesquisa e o contexto do usuário autenticado.

- **Listar Todos os Desafios** (`GET /challenges`)
  - **Ação:** Retorna uma lista global de todos os desafios criados.

- **Obter Desafio por ID** (`GET /challenges/:id`)
  - **Parâmetros de URL:** `id` do desafio.
  - **Ação:** Retorna os detalhes completos de um desafio específico.

- **Atualizar Desafio** (`PATCH /challenges/:id`)
  - **Parâmetros de URL:** `id` do desafio.
  - **Corpo da requisição:** Dados do desafio a atualizar.
  - **Ação:** Modifica os dados de um desafio existente.

- **Remover Desafio** (`DELETE /challenges/:id`)
  - **Parâmetros de URL:** `id` do desafio.
  - **Ação:** Cancela ou exclui um desafio existente.
