const { createTournament } = require("../../models/game")
const { Tournament, TournamentStatus } = require("../entities/tournament")
const { getTournaments, updateTournamentStatus, getTournamentsList, destroyTournamentDB } = require("../../models/game");

class TournamentService {
    constructor(matchmake_service) {
        this.activeTournaments = new Map();
        this.matchmake_service = matchmake_service;
    }
    
    async initialize() {
        this.activeTournaments.clear();
        const tournaments_db = await getTournamentsList();
        console.log("Loaded tournament from DB:", tournaments_db);
        tournaments_db.forEach((t) => {
            const tournament = new Tournament(t.id, t.name, t.created_by, t.time, t.prize_value);
            tournament.round = 0;
            tournament.players = new Array();
            this.activeTournaments.set(t.id, tournament);
        });
    }

    // async createNewTournament( tournament_name, created_by ) {
    //     try {
    //         const tournament_id = await createTournament( tournament_name, created_by );
    //         const new_tournament = new Tournament( tournament_id, tournament_name, created_by );
    //         this.activeTournaments.set( tournament_id, new_tournament );
    //         return new_tournament;
    //     } catch (e) {
    //         console.error("Error creating tournament:", e);
    //         return null;
    //     }
    // }

    async addPlayerToTournament( player, tournament ) {
        console.log( "adding player:", player.id, " to tournament :", tournament.id )
        tournament.addPlayer(player);
        player.tid = tournament.id;
        player.current_tournament = tournament;

        console.log(":TOURNAMENT: (", tournament.id, ") players updated to :", tournament.players.map(p => p.id));
        player.emit("tournament::joined");

        
        
        const tournament_players_data = await tournament.getBracketData();
        
        tournament.players.forEach(p => {
            p.socket.emit("tournament::bracket", tournament_players_data, tournament.round);
        });
        
        if ( tournament.empty_slots === 0 && tournament.status !== TournamentStatus.PLAYING ) {
            console.log(":TOURNAMENT: (", tournament.id, ") is full. Starting matches.");
            tournament.status = TournamentStatus.PLAYING;
            await updateTournamentStatus( tournament.id, tournament.status );
            tournament.startooo(this.matchmake_service);
        }
    }

    async destroyTournament( tournament ) {
        console.log(":TOURNAMENT: (", tournament.id, ") is being destroyed.");
        this.matchmake_service.sessionService.activeMatches.forEach( (match) => {
            if ( match.tournament_id === tournament.id ) {
                console.log(":TournamentService: destroying match id:", match.id, " of tournament id:", tournament.id);
                clearTimeout(match.timer);
                this.matchmake_service.sessionService.activeMatches.delete( match.id );
            }
        });
        this.activeTournaments.delete(tournament.id);
        await destroyTournamentDB(tournament.id);
    }

    async removePlayerFromTournament( player, tournament ) {
        console.log("removing player:", player.id, " from tournament :", tournament.id)
        tournament.removePlayer(player.id);
        player.tid = -1;
        player.current_tournament = null;

        //.. thinking to handle when someone exits before his match starts, should be looser :?
        // if ( tournament.status === TournamentStatus.PLAYING ) {
        //     tournament.someOneWins();
        // }

        console.log(":TOURNAMENT: (", tournament.id, ") players updated to :", tournament.players.map(p => p.id));
            
        const tournament_players_data = await tournament.getBracketData();

        tournament.players.forEach(p => {
            p.socket.emit("tournament::bracket", tournament_players_data, tournament.round);
        });
    }

    getTournamentPlayers( tournament_id ) {
        const tournament = this.activeTournaments.get(tournament_id);
        if (tournament) {
            return tournament.getPlayers();
        }
        return [];
    }

    getTournamentById( tournament_id ) {
        if (tournament_id === -1) return null;
        return this.activeTournaments.get(tournament_id);
    }

    getPlayersOfTournament( tournament_id ) {
        const tournament = this.activeTournaments.get(tournament_id);
        if (tournament) {
            return tournament.players;
        }
        return [];
    }

    getTournaments() {
        return Array.from(this.activeTournaments.values());
    }


    // startTournamentMatches( tournament, matchmakingService ) {
    //     if (!tournament) return;
        
    //     console.log("Starting matches for tournament:", tournament.id);
    //     tournament.startMatches(matchmakingService);
    // }
}

module.exports = {TournamentService};