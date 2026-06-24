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
  - **Ação:** Cria um novo desafio. Nota: Identifica a equipa criadora através do cookie `refreshToken` ou do Payload JWT.

- **Feed de Desafios** (`GET /challenges/feed`)
  - **Cabeçalhos:** Requer Autenticação (Access Token JWT).
  - **Parâmetros de Query (Opcionais):** `province`, `gameType`, `scheduledAt`.
  - **Ação:** Retorna o feed de desafios disponíveis, ativos e abertos (`#OPEN`), aplicando filtros de pesquisa e o contexto do usuário autenticado.

- **Listar Todos os Desafios** (`GET /challenges`)
  - **Ação:** Retorna uma lista global de todos os desafios criados não deletados logicamente (`isActive: true`).

- **Obter Desafio por ID** (`GET /challenges/:id`)
  - **Parâmetros de URL:** `id` do desafio.
  - **Ação:** Retorna os detalhes completos de um desafio específico válido/ativo.

- **Atualizar Desafio** (`PATCH /challenges/:id`)
  - **Parâmetros de URL:** `id` do desafio.
  - **Corpo da requisição:** Dados do desafio a atualizar.
  - **Ação:** Modifica os dados de um desafio existente.

- **Remover Desafio** (`DELETE /challenges/:id`)
  - **Parâmetros de URL:** `id` do desafio.
  - **Ação:** Remove o desafio através de **Soft Delete** (`isActive: false`). O desafio continuará no banco de dados isolado por motivos de históricos, porém não aparecerá mais em listas.

  ## 4.1 Solicitações (Requests) — entrar/sair de um desafio

  - **Criar solicitação (entrar num challenge)** (`POST /challenges/:id/requests`)
    - **Cabeçalhos:** Requer Autenticação (Bearer `access_token`)
    - **Parâmetros de URL:** `id` = `challengeId`
    - **Corpo da requisição (JSON):**
      - `teamId` (string) — ID da equipa que está a solicitar
    - **Ação:** Cria um registo em `requests` vinculando `teamId` ao `challengeId`.
    - **Código de sucesso:** `201 Created` com objeto da solicitação criada.

  - **Listar solicitações de um challenge** (`GET /challenges/:id/requests`)
    - **Cabeçalhos:** Requer Autenticação (Bearer `access_token`)
    - **Parâmetros de URL:** `id` = `challengeId`
    - **Ação:** Retorna lista de solicitações para esse `challengeId`, incluindo dados da equipa.
    - **Código de sucesso:** `200 OK`

  - **Cancelar solicitação / Sair do challenge** (`DELETE /challenges/:id/requests`)
    - **Cabeçalhos:** Requer Autenticação (Bearer `access_token`)
    - **Parâmetros de URL:** `id` = `challengeId`
    - **Corpo da requisição (JSON):**
      - `teamId` (string) — ID da equipa que quer sair/cancelar a solicitação
    - **Ação:** Inativa (Soft Delete) a solicitação correspondente, definindo `isActive: false` para o `challengeId + teamId`.
    - **Código de sucesso:** `200 OK` com o objeto atualizado

  ---

  ## 5. Contratos & DTOs (exemplos para o Frontend)

  ### CreateChallengeDto (POST /challenges)
  Exemplo de corpo (JSON):

  {
    "title": "Jogo amistoso",
    "description": "Partida amigável ao fim-de-semana",
    "location": "Campo da cidade",
    "province": "Lisboa",            # opcional — herdado da equipa se omitido
    "latitude": -9.142685,
    "longitude": 38.736946,
    "gameType": "v5v5",              # valores: v5v5 | v7v7 | v11v11
    "scheduledAt": "2026-06-01T18:00:00.000Z"
  }

  Resposta (201): objeto `challenge` com campos como `id`, `title`, `scheduledAt`, `teamId`, `status`.

  ### joinChallengeDto (POST /challenges/:id/requests)
  Exemplo de corpo (JSON):

  {
    "teamId": "team-123"
  }

  Resposta (201):
  {
    "id": "request-abc",
    "teamId": "team-123",
    "challengeId": "challenge-456",
    "status": "PENDING"
  }

  ### UpdateChallengeDto (PATCH /challenges/:id)
  Mesmos campos que `CreateChallengeDto` mas todos opcionais.

  ### Filter para feed (GET /challenges/feed)
  - Query params:
    - `province` (string)
    - `gameType` (v5v5 | v7v7 | v11v11)
    - `scheduledAt` (ISO datetime) — filtra por >=

  ---

  ## 6. Autenticação & Headers (o que o Frontend precisa)

  - Para rotas que exigem autenticação (criar challenge, feed, join, listar requests, update/delete), envie o header:

    Authorization: Bearer <access_token>

  - O fluxo esperado:
    1. `POST /auth/login` com `email` + `password` → retorna `access_token` (no body) e define cookie `refreshToken` (httpOnly). **O Access Token passa a expirar em 5 minutos**, sendo crucial implementar a lógica de Refresh eficientemente nas Responses/Axios Interceptors. O Payload do Access Token agora também devolve o `teamId`.
    2. Guardar `access_token` em memória (e.g., Redux or memory) e usar para chamadas autenticadas.
    3. Quando o `access_token` expirar, chamar `POST /auth/refresh` (cookie `refreshToken` será enviado automaticamente pelo browser) para obter novo `access_token`.

  - **Documentação Interativa (Scalar/Swagger):** Agora há suporte para teste direto pela documentação da API em `/api/docs`. Se desejar testar qualquer rota com Auth no navegador, copie o token retornado no `Login` e cole no menu 'Authentication > Bearer' do Scalar.

  Observação: Rotas públicas (ex: `GET /challenges`, `GET /challenges/:id`) não exigem header Authorization.

  ---

  ## 7. Erros comuns & Códigos HTTP

  - 400 Bad Request — parâmetros ou body inválido
  - 401 Unauthorized — token ausente/inválido
  - 403 Forbidden — operação não autorizada (ex: editar desafio de outra equipa)
  - 404 Not Found — recurso não encontrado (team, challenge, request)
  - 409 Conflict — por exemplo, tentar criar uma solicitação duplicada

  ---

  ## 8. Exemplos curl rápidos

  # Login
  curl -i -X POST https://api.example.com/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"secret"}'

  # Criar desafio (autenticado)
  curl -i -X POST https://api.example.com/challenges \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '@create-challenge.json'

  # Entrar num desafio (criar request)
  curl -i -X POST https://api.example.com/challenges/challenge-456/requests \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{"teamId":"team-123"}'

  # Listar requests de um challenge
  curl -i -X GET "https://api.example.com/challenges/challenge-456/requests" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

  ---

  ## 9. Notas para o Frontend

  - O backend usa `challenge.status` (OPEN / CLOSED / CANCELLED) para gerir visibilidade.
  - No feed (`/challenges/feed`) o backend automaticamente exclui desafios criados pela equipa do utilizador autenticado.
  - Para uploads (avatars/emblems) use `multipart/form-data` com campo `file`.
  - Se precisar de um contrato TypeScript exato, posso gerar `interfaces`/`types` a partir das DTOs atuais.

  ---

  Se quiser, gero também os `types` TypeScript prontos para importar no Frontend e exemplos de chamadas com `fetch()`/`axios`.
