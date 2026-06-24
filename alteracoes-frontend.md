# Alterações Recentes - Backend

## 1. Segurança

### Rate Limiting (Throttler)
- Limite de **60 requisições por 60 segundos** por IP.
- Se excedido, retorna `429 Too Many Requests`.
- **Frontend**: Tratar erro 429 e mostrar mensagem "Muitas requisições. Tente novamente mais tarde."

### Helmet
- Headers HTTP de segurança ativados (proteção XSS, Content Security Policy, etc).

### CORS
- Agora é **obrigatório** definir a env var `CORS_ORIGIN` (ex: `http://localhost:3000,http://localhost:5173`).
- Se não estiver configurada, a aplicação **não sobe** (erro ao iniciar).

### Validação Global (class-validator)
- Todas as requisições agora são validadas automaticamente:
  - `whitelist: true` — remove campos não declarados no DTO.
  - `forbidNonWhitelisted: true` — rejeita requisições com campos extras (`400 Bad Request`).
- **Frontend**: Enviar **apenas** os campos esperados pela API.

### Limite de Body
- JSON body limitado a **1MB**.

---

## 2. Verificação de Telefone (OTP via Twilio)

### Novo campo no Register
- `phone` (string, opcional) no body do `POST /auth/register`.
- Se enviado, o backend dispara um evento RabbitMQ para enviar OTP via SMS.

### Novo endpoint: `POST /auth/verify-phone`
```json
// Request
{
  "phone": "+258840000000",
  "code": "123456"
}

// Response 200
{
  "verified": true
}
```
- Status: `200 OK` se código válido, `4xx` se inválido.
- **Frontend**: Após register com phone, mostrar tela de inserção de código OTP e chamar este endpoint.

### Novo campo no User
- `phone` (string, unique) — número de telefone.
- `phoneVerified` (boolean) — se o telefone foi verificado.

---

## 3. Cache com Redis

### Dependência
- Redis é **obrigatório** (serviço no docker-compose, porta `6380`).
- Se Redis não estiver disponível, o servidor não sobe.

### Endpoints com Cache
| Endpoint | Cache TTL |
|---|---|
| `GET /challenges/feed` | 30s |
| `GET /challenges/my-challenges/:teamId` | 60s |
| `GET /challenges/:id/requests` | 30s |
| `GET /teams` | 10min |
| `GET /teams/:id` | 60min |
| `GET /matches/mine/:teamId` | 5min |
| `GET /matches/:id` | 10min |
| `GET /users` | 10min |
| `GET /users/:id` | 10min |
| `GET /ratings/:teamId/*` | 60min |

- **Frontend**: Operações de escrita (POST, PATCH, DELETE) invalidam o cache automaticamente. Não há necessidade de ação explícita.

---

## 4. Notificações Push (FCM)

### Novo provider de Push
- Integração com **Firebase Cloud Messaging** (FCM) via `firebase-admin`.
- Novo campo no User: `fcmToken` (string) — token de registo FCM do dispositivo.

### Eventos que disparam Push
| Evento | Título | Corpo |
|---|---|---|
| Partida confirmada | "Partida Confirmada" | "O seu desafio contra {teamName} foi confirmado!" |
| Novo desafio na área | "Novo Desafio na tua área" | "A equipa {teamName} criou um desafio!" |
| Solicitação recebida | "Nova solicitação" | "A equipa {teamName} quer juntar-se ao teu desafio!" |
| Solicitação recusada | "Solicitação recusada" | "O seu pedido para a equipa {teamName} foi recusado." |
| Partida cancelada | "Partida cancelada" | "A partida contra {teamName} foi cancelada." |

### Como usar
- **Frontend**: Após login, registar o dispositivo FCM e enviar o token via `PATCH /users/me`:
```json
{
  "fcmToken": "device-fcm-token"
}
```

---

## 5. Novos Eventos RabbitMQ

### Nova fila: `otp.queue`
- Exchange: `notifications_events`, Routing Key: `otp.send`
- Disparado quando um usuário faz register com `phone`.
- O notificador envia SMS com código OTP via Twilio Verify.

### Evento `match.cancelled`
- Exchange: `matchs_events`, Routing Key: `match.cancelled`
- Payload publicado quando uma partida é cancelada (`PATCH /matches/:id`).
- Notificação por email e push para **ambas as equipas**.

### Evento `request.created`
- Exchange: `requests_events`, Routing Key: `request.created`
- Payload publicado quando uma equipa solicita entrar num desafio.
- Notificação por email e push para o **dono do desafio**.

---

## 6. Novos Endpoints e Mudanças

### `POST /auth/verify-phone`
Verificar código OTP enviado por SMS.

### `PATCH /matches/:id` (agora protegido)
- Adicionado `@UseGuards(JwtGuard)` e `@ApiBearerAuth()`.
- **Frontend**: Enviar `Authorization: Bearer <token>` no header.

### `POST /matches/give-feedback` (agora protegido)
- Adicionado `@UseGuards(JwtGuard)` e `@ApiBearerAuth()`.

### `PATCH /teams/:id` (agora protegido)
- Adicionado `@UseGuards(JwtGuard)` e `@ApiBearerAuth()`.

### `PATCH /teams/:id/emblem` (agora protegido)
- Adicionado `@UseGuards(JwtGuard)` e `@ApiBearerAuth()`.

### `DELETE /teams/:id` (agora protegido)
- Adicionado `@UseGuards(JwtGuard)` e `@ApiBearerAuth()`.

---

## 7. DTOs - Campos Validados (enviar conforme especificação)

### Register (`POST /auth/register`)
```json
{
  "name": "string (min 2)",
  "email": "valid email",
  "passwordHash": "string (min 6)",
  "confirmPassword": "string (min 6)",
  "phone": "string (opcional)"
}
```

### Create Challenge (`POST /challenges`)
```json
{
  "province": "string",
  "title": "string (min 3)",
  "description": "string (opcional)",
  "location": "string",
  "latitude": "number (opcional)",
  "longitude": "number (opcional)",
  "gameType": "v5v5 | v7v7 | v11v11",
  "scheduledAt": "ISO date string"
}
```

### Join Challenge (`POST /challenges/:id/join`)
```json
{
  "teamId": "UUID",
  "challengeId": "UUID"
}
```

### Create Team (`POST /teams`)
```json
{
  "name": "string (min 2)",
  "ownerId": "UUID",
  "ownerRole": "CAPTAIN | COACH",
  "province": "string (opcional)"
}
```

### Match Feedback (`POST /matches/give-feedback`)
```json
{
  "matchId": "UUID",
  "appeared": "boolean",
  "score": "integer (1-5, opcional, default 3)",
  "comment": "string (opcional)",
  "teamId": "UUID"
}
```

### Cancel Match (`PATCH /matches/:id`)
```json
{
  "reason": "string",
  "id": "UUID"
}
```

### Accept Request (`POST /challenges/accept-request`)
```json
{
  "requestId": "UUID",
  "homeTeamId": "UUID"
}
```

---

## 8. Docker / Dev Setup

```bash
# Iniciar infraestrutura
docker compose up -d

# Serviços disponíveis:
# - Redis: localhost:6380
# - RabbitMQ: localhost:5672
# - RabbitMQ Management: http://localhost:15672 (guest/guest)

# Criar .env com:
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=...
REDIS_URL=redis://localhost:6380

# Rodar migrações
npx prisma migrate dev
```

---

## 9. Resumo de Breaking Changes

1. **CORS obrigatório** — `CORS_ORIGIN` deve estar no `.env`.
2. **Redis obrigatório** — `docker compose up -d` antes de rodar o backend.
3. **Validação estrita** — campos extras em qualquer request resultam em `400`.
4. **Vários endpoints agora requerem JWT** — matches (cancel, feedback) e teams (update, delete, upload emblem).
5. **Role de owner do Team** agora é string obrigatória (`CAPTAIN` ou `COACH`).
6. **Enum GameType** — valores normalizados para `v5v5`, `v7v7`, `v11v11`.
