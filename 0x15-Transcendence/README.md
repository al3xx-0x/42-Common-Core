# Transcendence

**final project** of 42 common core - full-stack, real-time multiplayer **pong game** platform with tournaments, chat, matchmaking, and user management.    built with modern web technologies and containerized with docker.

## description

comprehensive web application bringing classic pong into the modern era with real-time multiplayer, user authentication, social features, and competitive gameplay.    **capstone project** showcasing full-stack development, real-time communication, devops, and modern web architecture.

**demonstrates**: full-stack web (node.js + next.js), real-time communication (socket.io), auth (oauth2, jwt), database (sqlite), containerization (docker), security (vault, https), modern frontend (react, next.js, typescript), responsive design, i18n

## features

**game**: real-time multiplayer pong, matchmaking, tournaments (bracket-style), custom settings (ball speed, paddle size, score limits), game modes, live spectating, match history, leaderboard

**social**: user profiles (avatars, stats), friends system, real-time chat (public channels, private messages), online status, user blocking, notifications, emoji support

**auth & security**: oauth2 (google), jwt authentication, email verification, password hashing (bcrypt), vault integration, https (ssl/tls), cors protection

**ux**: internationalization (en/fr/es/am), responsive design, dark/light theme, real-time updates (socket.io), toast notifications, progress indicators, error handling

## architecture

**tech stack**:
- **frontend**: next.js 14, typescript, react 18, tailwind css, radix ui, socket.io client, chart.js, react hook form, i18next, framer motion
- **backend**: node.js, fastify, socket.io, sqlite3, jwt, bcrypt, oauth2, nodemailer, vault
- **devops**: docker, docker compose, nginx, vault

## project structure

```
0x15-transcendence/
├── docker-compose.yml           # container orchestration
├── backend/                     # node.js backend
│   ├── src/
│   │   ├── server.  js, socket.js, db.js
│   │   ├── controllers/         # auth, game, friends, notifications, settings
│   │   ├── models/              # user, game, friends, notification, block
│   │   ├── routes/              # auth, user, notification
│   │   ├── game/                # socket, entities (ball, player, match, queue, tournament), listeners, services
│   │   ├── chat/                # socket, savedmessages
│   │   ├── schemas/             # validation (auth, user)
│   │   ├── utils/               # hash, jwt, email, vault
│   │   └── plugins/             # auth
├── front-end/                   # next.js frontend
│   ├── src/
│   │   ├── app/                 # app router ((app): home, game, chat, friends; (auth))
│   │   ├── components/          # ui, notification, tournament, theme
│   │   ├── context/             # socketcontext
│   │   ├── hooks/               # use-mobile, use-toast
│   │   └── lib/
│   └── public/                  # images, locales (en/fr/es/am)
├── nginx/                       # reverse proxy (ssl)
└── vault/                       # secrets management
```

## getting started

**prerequisites**: docker (20. 10+), docker compose (2.0+), git, modern browser

**installation**:
```bash
# 1. clone repo
cd /path/to/transcendence

# 2. configure environment
# backend/.env:
PORT=3000
SERVER_URL=https://localhost
DB_PATH=./database.db
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_USER/PASS/HOST/PORT=...  
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=myroottoken

# front-end/.env. local:
NEXT_PUBLIC_API_URL=https://localhost/api
NEXT_PUBLIC_SOCKET_URL=https://localhost

# 3. build and run
docker-compose up --build -d

# 4. access
https://localhost  # accept self-signed ssl cert
```

## usage

**registration/login**: create account → verify email → login (email/password or google oauth)

**playing pong**:
- **quick match**: play now → wait for matchmaking → use arrow keys/wasd to control paddle
- **tournament**: join tournament → wait for 4/8 players → bracket displays → advance through rounds
- **custom settings**: adjust ball speed, size, paddle size, score limit, background

**chat**: select/create channel → send messages (emoji support) → private messages (click profile → send message)

**friends**: search users → send request → view online status → challenge to game

**profile**: upload avatar → update display name → view stats (win/loss, total games, tournaments, match history)

**controls**: ↑/w (up), ↓/s (down), esc (pause), enter (ready)

## api endpoints

**auth**: `post /api/auth/register`, `post /api/auth/login`, `get /api/auth/verify/:token`, `get /api/login/google`  
**user**: `get/put /api/user/profile`, `post /api/user/avatar`, `get /api/user/search`  
**friends**: `get /api/friends`, `post /api/friends/request`, `put /api/friends/accept/:id`, `delete /api/friends/:id`  
**game**: `get /api/games`, `get /api/leaderboard`, `get /api/tournaments`  
**notifications**: `get /api/notifications`, `put /api/notifications/:id/read`

## websocket events

**game**: client → server: `join_queue`, `paddle_move`, `ready`; server → client: `match_found`, `game_state`, `game_over`, `tournament_update`  
**chat**: client → server: `join_room`, `send_message`, `typing`; server → client: `new_message`, `user_joined`, `user_left`

## docker services

| service | port | description |
|---------|------|-------------|
| nginx | 443 | reverse proxy (ssl) |
| frontend | 3001 | next.js app |
| backend | 3000 | fastify api |
| vault | 8200 | secrets management |

**commands**: `docker-compose up -d` (start), `docker-compose logs -f backend` (logs), `docker-compose down` (stop), `docker-compose up -d --build` (rebuild)

## key features

**matchmaking**: join queue → find opponent → create match → notify players → sync game state  
**tournament**: create/join (4/8 players) → generate bracket → play rounds → crown champion → update leaderboard  
**real-time chat**: websocket connection → join rooms → send/receive instantly → emoji support → online presence

## security

https only (tls), jwt authentication, bcrypt hashing, cors protection, input validation (zod), sql injection prevention (parameterized queries), xss protection (react escaping), csrf protection, rate limiting, vault secrets

## database schema

**users**: id, username, email, password, avatar, created_at, is_verified, oauth_provider  
**games**: id, player1/2_id, winner_id, scores, tournament_id, round, created_at  
**friends**: id, user_id, friend_id, status (pending/accepted), created_at

## troubleshooting

**containers won't start**: check logs (`docker-compose logs`), rebuild (`docker-compose down -v && docker-compose up --build`)  
**websocket failed**: verify cors, check socket_url, ensure https certs valid  
**database errors**: reset (`docker-compose down -v`), check migrations (`sqlite3 database.db`)  
**vault issues**: check logs (`docker-compose logs vault`), verify vault_token, restart (`docker-compose restart vault`)

---

**grade**: validated ✅  
**developed by**:  sbouabid & mait-elk & aabouqas & ibouram
**timeline**: team project (4 students), ~6 months, final common core project
**created**: novomber 11, 2025
*"the ultimate 42 project - where everything comes together!  "* 🏓🚀