const fp = require("fastify-plugin");
const { Player, PlayerStatus } = require("./entities/player");
const { Match, MatchStatus } = require("./entities/match");
const { PlayersQueue } = require("./entities/queue");
const { MatchmakerService } = require("./services/matchmake");
const { TournamentService } = require("./services/tournament");
const { GameSessionService } = require("./services/gamesession");
const { Tournament, TournamentStatus } = require("./entities/tournament");
const { getTournamentByName} = require("../models/game");

let matchmake_service = new MatchmakerService(new PlayersQueue(), new GameSessionService());
let tournaments_service = new TournamentService(matchmake_service);
matchmake_service.tournaments_service = tournaments_service;


// listeners
const { MatchmakingListener } = require("./listeners/matchmaking");
const matchmaking_listener = new MatchmakingListener(matchmake_service);
const { GameplayListener } = require("./listeners/gameplay");
const gameplay_listener = new GameplayListener(matchmake_service);
const { TournamentListener } = require("./listeners/tournament");
const tournament_listener = new TournamentListener(tournaments_service, matchmake_service);

const { updateLogtimeOfToday } = require("../models/userModel");

module.exports = fp(async function (fastify) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>connected to game serveeeeeeeeer");
    // Get the existing Socket.IO instance from the chat socket
    if (!fastify.io) {
        throw new Error('Socket.IO instance not found. Make sure chat socket is registered first.');
    }

    const io = fastify.io;
    const online_players = new Map();

    matchmake_service.online_players = online_players;

    await tournaments_service.initialize();

    // console log : 2025-11-06

    // debugging the current game state
    fastify.get("/game_log", async (req, reply) => {
            const resp = {
            "online_players:": Array.from(online_players.values()).map(p => ({
                id: p.id,
                tid: p.tid,
                matchId: p.matchId,
            })),
            "size:": matchmake_service.queue.players.length,
            queue_players: matchmake_service.queue.players.map(p => ({
                id: p.id,
                status: p.status
            })),
            waiting_matches: Array.from(matchmake_service.sessionService.activeMatches.values()).map(m => ({
                id: m.id,
                status: m.status,
                player1: { id: m.player1.id, status: m.player1.status, mid: m.player1.matchId },
                player2: { id: m.player2.id, status: m.player2.status, mid: m.player1.matchId }
            })),
            tournaments: Array.from(tournaments_service.activeTournaments.values()).map(t => ({
                id: t.id,
                name: t.name,
                players: t.players.map(p => ({
                    id: p.id,
                    connected: p.socket.connected,
                })),
                status: t.status,
            }))
        };
        return resp;
    });

    // API ROUTES
    fastify.register( (fastify) => {
        fastify.get("/", async (req, reply) => {
            return "Backend Server is running.";
        });
        fastify.register( (fastify) => {
            fastify.get("/", async (req, reply) => {
                return "Game Server is running.";
            });

            fastify.register( (fastify) => {

                fastify.get("/", async (req, reply) => {
                try {
                    // let from = parseInt(req.query.offset) || 0;
                    // if (isNaN(from) || from < -1) from = 0;

                    console.log("called tournaments/. we have : ", tournaments_service.activeTournaments.size);

                    const tournaments = Array.from(tournaments_service.activeTournaments.values()).map(t => ({
                        id: t.id,
                        time: t.time,
                        name: t.name,
                        created_by: t.created_by,
                        prize_value: t.prize_value,
                        players_count: t.players.length
                    }));

                    // console.log("Fetching tournaments from offset:", tournaments);

                    // if (tournaments.error) return reply.status(400).send({ error: 'invalid Query' });

                    return { tournaments };

                } catch (e) {
                    console.error("Error fetching tournaments:", e);
                    return reply.status(400).send({ error: 'Unexpected error', details: e.message });
                }

                });

                fastify.get("/search", async (req, reply) => {
                    const name = req.query.name ? req.query.name : null;
                    if (!name) {
                        return reply.status(400).send({ error: 'Invalid search query' });
                    }

                    const results = await getTournamentByName(name);

                    // making new array and store only ids and names from results
                    const arr = results.map( (t) => {
                        return {
                            id: t.id,
                            name: t.name,
                            created_by: t.created_by,
                            time: t.time,
                            status: t.status,
                            prize_value: t.prize_value,
                            players_count: ( t.status !== "COMPLETED" ) ? tournaments_service.getPlayersOfTournament(t.id).length : t.players_count
                        };
                    });
                    return arr;
                });

            }, { prefix: "/tournaments" });

        }, { prefix: "/game" });

    }, { prefix: "/api" });

    io.on("connection", async (socket) => {
        const userId = socket.user && socket.user.id ? String(socket.user.id) : null;
        console.log("connected to game serveeeeeeeeer using id: ", socket.id, " userId: ", userId);

        const player = new Player(userId, socket);
        const isAlreadyConnected = online_players.has(player.id);

        if (userId === null) {
            socket.disconnect();
            return;
        }

        if (isAlreadyConnected) {
            console.log("user tries to connect to the game server: >> ? ", userId);
            socket.emit("error", "This User is Already Connected, Your Actions On this session are limited.."); // true == exit immediately
            socket.disconnect();
            return;
        }

        player.start_logtime = Date.now();
        console.log("user connected to game server: ", player.id, " logtime start at :", player.start_logtime );
        online_players.set(player.id, player);

        matchmaking_listener.register(socket, player);
        tournament_listener.register(socket, player);
        gameplay_listener.register(socket, player);

        socket.on("disconnect", async () => {
            player.status = PlayerStatus.IDLE;
            console.log("user disconnected from game server: ", player.id);
            console.log(player.id, ": DISCONNECTED GID:", player.matchId);
            if ( player.current_tournament !== null && player.current_tournament.status !== TournamentStatus.PLAYING ) {
                console.log(":TOURNAMENT: player : ", player.id, " disconnected and was in tournament id: ", player.tid, " so removing him from there.");
                await tournaments_service.removePlayerFromTournament(player, player.current_tournament);
            }
            if ( player.current_tournament !== null && player.current_tournament.status === TournamentStatus.PLAYING ) {
                const offline_users = tournaments_service.getPlayersOfTournament(player.current_tournament.id).filter( p => !p.socket.connected );
                console.log(":TOURNAMENT: player : ", player.id, " disconnected but tournament id: ", player.tid, " is already PLAYING so cannot remove him. current offline players in this tournament: ", offline_users.length );
                if ( offline_users.length >= 4 ) {
                    tournaments_service.destroyTournament(player.current_tournament);
                }
            }
            matchmake_service.playerLeaves(player, "disconnect");
            // await matchmake_service.removePlayer(player, "disconnect");
            const curr = player.start_logtime;
            const now = Date.now();

            // calculate total online time in seconds
            const total_online_time = Math.floor( (now - curr) / 1000 );
            // const minutes = Math.floor(total_online_time / 60);

            updateLogtimeOfToday(player.id, total_online_time);
            console.log("player id: ", player.id, " total online time (total_online_time): ", total_online_time );
            online_players.delete(player.id);
        });
    });
});