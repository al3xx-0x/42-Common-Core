const { Point } = require("./point");
const { BOARD_HEIGHT } = require("./match");

const PlayerStatus = {
  IDLE: "idle",
  SEARCHING: "searching",
  MATCHED: "matched",
  IN_GAME: "in_game",
}

class Player {
  constructor(id, socket ) {
    this.id = parseInt(id);
    this.socket = socket;
    this.status = PlayerStatus.IDLE;
    this.matchId = null;
    this.opponent = null;
    this.scale = new Point(20, 100);
    this.positionY = (BOARD_HEIGHT / 2) - 50;
    this.key_up = false;
    this.key_down = false;
    // this.goals = 0;
    
    this.tid = -1;
    this.current_tournament = null;
    this.start_logtime = null;

    this.alias = null;
  }

  emit(event_name, ...args) {
    if ( this.socket && this.socket.connected ) {
      this.socket.emit(event_name, ...args);
    }
  }

  reset_state() {
    this.positionY = (BOARD_HEIGHT / 2) - 50;
  }
}

module.exports = { Player, PlayerStatus };