class PlayerInfo {
    id;
    
    constructor( id ) {
        this.id = id;
    }
}

class Player {
    info;
    socket;
    game_id;
    peer;
    is_ready;

    constructor( id, socket ) {
        this.info = new PlayerInfo(id);
        this.socket = socket;
        this.game_id = -1;
        this.peer = null;
        this.is_ready = false;
    }
}

class MatchInfo {
    player_1;
    player_2;

    constructor( player_1, player_2 ) {
        this.player_1 = player_1;
        this.player_2 = player_2;
    }
}


const ServerMMResponse = {
    ERR_UNDEFINED: -1,

    OK_ACCEPTED: 0,

    OK_FIND_MATCH: 1,
    OK_MATCH_CANCEL: 2,
    OK_MATCH_FOUND: 3,
    OK_MATCH_START: 4
}

module.exports = { ServerMMResponse, PlayerInfo, Player, MatchInfo };