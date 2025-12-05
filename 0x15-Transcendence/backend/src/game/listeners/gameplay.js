class GameplayListener {
    constructor(matchmakingService) {
        this.matchmakingService = matchmakingService;
    }

    register(socket, player) {
        socket.on("key_pressed", (info) => {
            const match = this.matchmakingService.sessionService.activeMatches.get(player.matchId);
            if (!match) return;
            console.log("match osff::", player.matchId);
            if (info.pressed) {
                if ( info.key === "ArrowUp" ) {
                    if ( info.vid == 1 )
                        match.player1.key_up = true;
                    else
                        match.player2.key_up = true;
                }else {
                    if ( info.vid == 1 )
                        match.player1.key_down = true;
                    else
                        match.player2.key_down = true;
                }
            } else {
                if ( info.key === "ArrowUp" ) {
                    if ( info.vid == 1 )
                        match.player1.key_up = false;
                    else
                        match.player2.key_up = false;
                }else {
                    if ( info.vid == 1 )
                        match.player1.key_down = false;
                    else
                        match.player2.key_down = false;
                }
            }

            console.log("player: ", info.id, " pressed: ", info.key, " status:", info.pressed, "(vid=", info.vid,")");
        });
        socket.on("ready", () => {
            // const match = matchmake_service.sessionService.activeMatches.get(player.matchId);
            // console.log("player id: " , player.id , " is ready in :", match.id);
        });
    }
}

module.exports = { GameplayListener };