const { TournamentStatus, Tournament } = require("../entities/tournament");
const { createTournament, getTournamentById } = require("../../models/game")


class TournamentListener {
    constructor(tournamentsService, matchmakingService) {
        this.tournamentsService = tournamentsService;
        this.matchmakingService = matchmakingService;
    }

    register(socket, player) {

        socket.on("tournament::create", async (name, creator_id, alias) => {
            console.log(":TOURNAMENT: create tournament request by player ", player.id, " with name: ", name, " and alias: ", alias);
            if ( !alias || alias.length === 0 ) return;
            if ( player.current_tournament !== null || player.tid !== -1 ) {
                console.log(":TOURNAMENT: player : ", player.id, " already in tournament id: ", player.tid);
                return;
            }
            
            const tournament_id = await createTournament(name, creator_id);
            const t = await getTournamentById(tournament_id);
            const new_tournament = new Tournament( tournament_id, name, creator_id, t.time, t.prize_value );
            console.log("Tournament created with ID:", tournament_id, " Data:", t);
            this.tournamentsService.activeTournaments.set( tournament_id, new_tournament );

            console.log(":TOURNAMENT: created tournament id: ", new_tournament.id, " by player ", player.id, " and added him to it");
            player.alias = alias.slice(0, 12);
            player.emit("tournament::create", new_tournament);
            await this.tournamentsService.addPlayerToTournament( player, new_tournament );
        });

        socket.on("tournament::join", async (tourn_id, alias) => {
            if ( !alias || alias.length === 0 ) return;
            alias = alias.slice(0, 12);
            if (player.current_tournament !== null || player.tid !== -1 ) {
                console.log(":TOURNAMENT: player : ", player.id, " already in tournament id: ", player.tid);
                return;
            }
            
            const tournament = this.tournamentsService.getTournamentById(tourn_id);
            if (!tournament) { 
                console.log(":TOURNAMENT: cannot find tournament id: ", tourn_id, " for player ", player.id);
                return;
            }

            if (tournament.players && tournament.players.find( p => p.alias === alias )) { 
                console.log(":TOURNAMENT: player ", player.id, " tried to join tournament id: ", tourn_id, " with an existing alias: ", player.alias);
                player.emit("error", "your alias already exists in this tournament. Choose another one.");
                return;
            }

            if ( tournament.players.length === 4 || tournament.status !== TournamentStatus.PENDING ) {
                console.log(":TOURNAMENT: (", tournament.id, ") is full/playing. Player ", player.id, " cannot join.");
                return;
            }

            player.alias = alias.slice(0, 12);
            await this.tournamentsService.addPlayerToTournament( player, tournament );
            console.log(":TOURNAMENT: (", tournament.id, ") #players updated to :", tournament.players.map(p => p.id));
        });




        socket.on("tournament::leave", async () => {
            if (player.current_tournament === null || player.tid === -1 ) {
                console.log(":TOURNAMENT: player : ", player.id, " not in any tournament to leave. tid:", player.tid);
                return;
            }

            const tournament = player.current_tournament;
            if (!tournament) return;

            if ( tournament.status === TournamentStatus.PLAYING ) {
                console.log(":TOURNAMENT: (", tournament.id, ") already started. Player ", player.id, " tries to leave so he will be just a bot with zero thinking and he can join again to another one.");
                
                
                if ( tournament !== null && tournament.status === TournamentStatus.PLAYING ) {
                    tournament.in_plrs--;
                    console.log(":TOURNAMENT: player : ", player.id, " disconnected but tournament id: ", player.tid, " is already PLAYING so cannot remove him. current offline players in this tournament: ", tournament.in_plrs );
                    if ( tournament.in_plrs >= 4 ) {
                        this.matchmakingService.destroyTournament(tournament);
                    }
                }

                player.tid = -1;
                player.current_tournament = null;
                return;
            }

            player.alias = null;
            await this.tournamentsService.removePlayerFromTournament(player, tournament);
            console.log(":TOURNAMENT: (", tournament.id, ") !#players updated to :", tournament.players.map(p => p.id));
        });


        socket.on("tournament::bracket", async () => {
            if ( player.current_tournament === null || player.tid === -1 ) {
                console.log(":TOURNAMENT: player : ", player.id, " not in any tournament.");
                player.emit("tournament::bracket", [], 0);
                return;
            }

            const tournament = player.current_tournament;

            console.log(":TOURNAMENT: (", tournament.id, ") round ==> ", tournament.round, " CALLED BY PLAYER :", player.id);

            const data = await tournament.getBracketData();
            tournament.players.forEach( (p) => {
                p.socket.emit("tournament::bracket", data, tournament.round);
            });
        });
    }
}

module.exports = { TournamentListener };