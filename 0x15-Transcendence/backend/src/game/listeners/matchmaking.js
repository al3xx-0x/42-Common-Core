const { PlayerStatus } = require("../entities/player");
class MatchmakingListener {
    constructor(matchmakingService) {
        this.matchmakingService = matchmakingService;
    }

    register(socket, player) {
        socket.on("matchmake", ( ) => {
            player.alias = null;
            this.matchmakingService.addPlayer(player);
            console.log(player.id, ": MATCHMAKING GID:", player.matchId);
        });

        socket.on("matchmake::pvp", ( oppo_id ) => {
            // this.matchmakingService.addPlayer(player);
            // console.log(player.id, ": MATCHMAKING GID:", player.matchId);
            const opponent = this.matchmakingService.online_players.get(oppo_id);
            // console.log(" new pvp match request from ", player.id, " to ", (oppo_id), " found opponent :", opponent );
            if ( !opponent ) {
                console.log("accepted invite but the opponent are offline.");
                player.emit("error", "opponent currently are offline :( try later."); // false == do not exit immediately
                return;
            }
            this.matchmakingService.requestPVPMatch(player, opponent);
        });

        socket.on("im_left", async () => {
            console.log("opsss called left?");
            player.status = PlayerStatus.IDLE;
            this.matchmakingService.playerLeaves(player, "left");
            // await this.matchmakingService.removePlayer(player, "left");
            // if ( player.current_tournament !== null ) {
            //     await tournaments_service.removePlayerFromTournament(player, player.current_tournament);
            // }
        });
    }
}

module.exports = { MatchmakingListener };