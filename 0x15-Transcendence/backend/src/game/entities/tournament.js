const { Match } = require("./match");
const { Player } = require("./player");
const { Round } = require("./round");

const { updateTournamentStatus, addScoreToPlayer } = require("../../models/game");

const TournamentStatus = { 
    PENDING: "PENDING",
    PLAYING: "PLAYING",
    COMPLETED: "COMPLETED"
};
class Tournament {
    constructor ( id, name, created_by, time, prize_value ) {
        this.id = parseInt(id);
        this.name = name;
        this.created_by = created_by;
        this.max_players = 4;
        this.empty_slots = this.max_players;
        this.in_plrs = this.max_players;
        this.leavers = 0;
        this.time = time;
        this.prize_value = prize_value;
        this.status = TournamentStatus.PENDING;
        this.rounds = [];
        this.round = 0;
        this.players = new Array();
        this.winner = null;
        this.matches = new Map();

        const round = new Round(this.rounds.length);
        this.rounds.push(round);


        this.matchmake_service = null;
    }

    addPlayer( player ) {
        this.players.push(player);
        this.rounds[this.round].players.push(player);
        this.empty_slots--;
    }
    
    removePlayer( player_id ) {
        this.players = this.players.filter( (p) => p.id != player_id );
        this.rounds[this.round].players = this.rounds[this.round].players.filter( (p) => p.id != player_id );
        this.empty_slots++;
    }

    getPlayersCount() {
        return this.players.length;
    }
    

    startooo( matchmake_service ) {
        this.matchmake_service = matchmake_service
        console.log(":TOURNAMENT: (", this.id, ") initializing tournament with players:", this.players.map(p => p.id));        
        // this.status = TournamentStatus.PLAYING;
        // console.log("called start with :", matchmake_service);
        this.start(matchmake_service);
    }

    start(matchmakingService) {
        console.log("Tournament ", this.id, " starting matches with players:", this.players.map(p => p.id));

        const round = this.rounds[this.round];

        for (let i = 0; i < round.players.length ;) {
            console.log("ids: ", i, " >> ", i +1);
            const me = round.players[i];
            const opp = round.players[i +1];

            const match = matchmakingService.addPVPMatch(me, opp, this.id, this.round, this);
            round.addMatch(match.id, match);
            i += 2;
        }
        console.log(":TOURNAMENT: (", this.id, ") Matches initialized:", this.matches);
    }

    someOneWins( match, winner, looser ) {
        console.log("Tournament ", this.id, " received win from match ", match, " by player ", winner.id);
        const round = this.rounds[this.round];

        winner.matchId = null;
        winner.matchId = null;
        
        let nextround = this.round + 1;
        let nround = this.rounds[nextround] || (this.rounds[nextround] = new Round(nextround));
        
        let hell = 0;
        for ( const mmm of round.matches.values() ) {
            const wnr = mmm.winner ? mmm.winner : null;
            nround.players[hell] = wnr;
            hell++;
        }

        round.endMatch(match.id);
        if ( round.completed ) {
            console.log(":TOURNAMENT: (", this.id, ") Round ", this.round, " completed.");
            // const next_round = nround;
            // next_round.players = round.winners;
            // this.rounds.push(next_round);
            this.round++;
            
            const r = this.rounds[this.round];
            if (r.players.length > 1) {
                console.log(":TOURNAMENT: (", this.id, ") Notifying players for next round...");
                r.players.forEach((player) => {
                    if (player && player.socket && player.socket.connected) {
                        player.socket.emit('notification', {
                            type: 'tournament',
                            content: `Your next tournament match is starting`,
                            tournament_id: this.id,
                            tournament_name: this.name,
                            round: this.round,
                            timestamp: new Date().toISOString()
                        });
                        console.log(`:TOURNAMENT: Notification sent to player ${player.id} for round ${this.round}`);
                    }
                });
                
                setTimeout(() => {
                    this.start(this.matchmake_service);
                }, 3000);
            }else {
                console.log("matchhh last winner iss>>>>", match.winner);
                this.status = TournamentStatus.COMPLETED;
                updateTournamentStatus( this.id, TournamentStatus.COMPLETED )
                    .then( () => {
                        console.log("MATCH TAGGED AS COMPLETED, so :) add points ola li bghiti for player id:", match.winner.id);
                        addScoreToPlayer( match.winner.id, this.prize_value ).then( () => {
                            console.log("Points", this.prize_value, " added to player id:", match.winner.id);
                        });
                    });
                console.log(":TOURNAMENT: (", this.id, ") Tournament COMPLETED. Winner is player ", match.winner.id);
                console.log("ops not thisuu", this.matchmake_service);
                // r.players.forEach((player) => {
                //     player.alias = null;
                // });
                this.matchmake_service.tournaments_service.activeTournaments.delete(this.id);
                // this.matchmake_service.initialize();
            }
        }
    }

    playerDisconnected() {
        
    }

    getBracketDataForPlayer ( ) {
        const bracket_data = [];
        this.rounds.forEach( (rnd) => {
            const round_data = [];
            rnd.matches.forEach( (match) => {
                const match_data = match.winner || null;
                round_data.push(match_data);
            });
            bracket_data.push(round_data);
        });
        console.log("Bracket data for tournament ", this.id, " :", bracket_data);
        return bracket_data;
    }

    async getBracketData() {
        const bracket_fullinfo = {};

        const semifinals = this.rounds[0] ? await this.rounds[0].getPlayersData() : [];
        const finals = this.rounds[1] ? await this.rounds[1].getPlayersData() : [];
        const winner = this.rounds[2] ? await this.rounds[2].getPlayersData() : [];

        bracket_fullinfo.semifinals = semifinals;
        bracket_fullinfo.finals = finals;
        bracket_fullinfo.winner = winner ? winner : null;

        console.log("data for tournament ", this.id, " :", bracket_fullinfo, " rounds:", this.rounds.length, " current round:", this.round);
        return bracket_fullinfo;
    }
}

module.exports = { Tournament, TournamentStatus }