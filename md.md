Você é um designer e desenvolvedor frontend especialista em apps mobile.

## Produto
**Onze** — app mobile para equipas de futebol amador criarem e aceitarem desafios entre si.

## Público-alvo
Capitães e treinadores de equipas amadoras de futebol.

## Identidade Visual
- Estilo: **energético, moderno, desportivo**
- Tema: **escuro** (dark mode)
- Cor primária: verde vibrante (`#00E676`) ou laranja (`#FF6D00`) — escolhe o que melhor representa competição desportiva
- Tipografia: bold, forte, sem serifa
- Inspiração: apps como Sofascore, Nike, ESPN

## Ecrãs a desenvolver (por ordem)

### 1. Onboarding
- Splash screen com logo Onze
- Ecrã de boas-vindas com CTA "Criar conta" e "Entrar"

### 2. Auth
- **Registo:** nome, email, password
- **Login:** email, password + link "Esqueci a password"

### 3. Criar Equipa (pós-registo)
- Nome da equipa
- Seleção de papel: **Capitão** ou **Treinador** (cards visuais, não dropdown)
- Botão "Criar Equipa"

### 4. Feed de Desafios (Home)
- Lista de desafios abertos
- Cada card mostra: nome da equipa, tipo de jogo (5v5 / 7v7 / 11v11), data, local, rating da equipa
- Filtros no topo: tipo de jogo, data
- FAB (Floating Action Button) para criar desafio

### 5. Detalhe do Desafio
- Info completa: título, descrição, local, data, tipo de jogo
- Card da equipa criadora com rating (estrelas)
- Botão "Candidatar-me" (se não for meu desafio)
- Estado do desafio: OPEN / CLOSED / CANCELLED (badge colorido)

### 6. Criar Desafio
- Título
- Descrição (opcional)
- Local (campo de texto + picker de coordenadas no futuro)
- Data e hora
- Tipo de jogo (5v5 / 7v7 / 11v11) em cards selecionáveis
- Botão "Publicar Desafio"

### 7. Os Meus Desafios
- Lista de desafios criados pela minha equipa
- Badge de status em cada card
- Indicador de pedidos pendentes (ex: "3 pedidos")

### 8. Pedidos Recebidos
- Lista de equipas que querem jogar
- Cada item: nome da equipa, rating, data do pedido
- Botões: **Aceitar** (verde) e **Rejeitar** (vermelho)

### 9. Os Meus Jogos
- Lista de jogos confirmados
- Cada card: adversário, data, local, tipo de jogo
- Badge de status: CONFIRMED / CANCELLED

### 10. Detalhe do Jogo
- Info completa do jogo
- As duas equipas (casa vs visitante)
- Botão "Dar Feedback" (após data do jogo)

### 11. Feedback Pós-Jogo
- Pergunta: "A equipa adversária apareceu?" (toggle Sim/Não)
- Comentário (opcional)
- Botão "Enviar Feedback"

### 12. Notificações
- Lista cronológica
- Ícone por tipo: REQUEST_RECEIVED, REQUEST_ACCEPTED, REQUEST_REJECTED, MATCH_CONFIRMED
- Badge de não lidas
- Tap → navega para o recurso relacionado

### 13. Perfil
- Avatar, nome, email
- Card da equipa com nome, papel (Capitão/Treinador), rating
- Botão "Editar Perfil"
- Botão "Sair"

## Navegação