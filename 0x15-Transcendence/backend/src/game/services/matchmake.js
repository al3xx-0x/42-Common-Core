const { Match, MatchStatus } = require("../entities/match");
const { Player } = require("../entities/player");

class MatchmakerService {
  constructor(queue, sessionService) {
    this.queue = queue;
    this.sessionService = sessionService;
    this.autoMatchId = 1;
    this.gameplayLoop();
    this.online_players = null;
    this.tournaments_service = null;
  }

  addPVPMatch(p1, p2, tournament_id, round_id, tournament_instance) {
    if ( p1 == null || p2 == null ) return;
    p1.reset_state();
    p2.reset_state();
    const match = new Match(this.autoMatchId++, p1, p2, tournament_id, round_id, tournament_instance);
    
    
    match.timer = setTimeout(() => {


      // console.log
      p1.socket.emit( "tournament::start", {opponent_id: p2.id, vid: 1, opp_alias: p2.alias, alias: p1.alias} );
      p2.socket.emit( "tournament::start", {opponent_id: p1.id, vid: 2, opp_alias: p1.alias, alias: p2.alias} );

      match.status = MatchStatus.PLAYING;
      
      console.log("custom pvp match created match id: ", match.id, " for player1: ", p1.id, " and player2: ", p2.id);
    }, 1500);
    
    p1.matchId = match.id;
    p2.matchId = match.id;
    
    p1.status = "matched";
    p2.status = "matched";
      
    this.sessionService.addMatch(match);
    return match;
  }

  addPlayer(player) {
    this.queue.add(player);
    this.tryMatch();
  }

  async removePlayer(player, reason) {
    if (player.matchId) {
      await this.sessionService.endMatch(player.matchId, reason);
    }else {
      this.queue.remove(player);
    }
  }

  requestPVPMatch(p1, p2) {
    if (p1.socket.connected && p2.socket.connected) {
      p1.reset_state();
      p2.reset_state();
      p1.alias = null;
      p2.alias = null;
      const match = new Match(this.autoMatchId++, p1, p2);

      console.log("match created with id: ", match.id, " for player1: ", p1.id, " and player2: ", p2.id);

      match.timer = setTimeout(() => {
        p1.emit( "match_start" );
        p2.emit( "match_start" );

        match.status = MatchStatus.PLAYING;
      }, 1500);

      console.log("setting interval>>>>>>>>>>> :", match.timer);

      p1.matchId = match.id;
      p2.matchId = match.id;

      p1.status = "matched";
      p2.status = "matched";

      this.sessionService.addMatch(match);

      p1.emit("matchmake::pvp", { opponent_id: p2.id, vid: 1 });
      p2.emit("matchmake::pvp", { opponent_id: p1.id, vid: 2 });
    }
  }

  tryMatch() {
    const [p1, p2] = this.queue.popTwo();
    if (p1 && p2) {
      p1.reset_state();
      p2.reset_state();
      const match = new Match(this.autoMatchId++, p1, p2);

      console.log("match created with id: ", match.id, " for player1: ", p1.id, " and player2: ", p2.id);

      match.timer = setTimeout(() => {
        p1.emit( "match_start" );
        p2.emit( "match_start" );

        match.status = MatchStatus.PLAYING;
      }, 1500);

      console.log("setting interval>>>>>>>>>>> :", match.timer);

      p1.matchId = match.id;
      p2.matchId = match.id;

      p1.status = "matched";
      p2.status = "matched";

      this.sessionService.addMatch(match);

      p1.emit("matchmake", { type: "match_found", opponent: p2.id, vid: 1 });
      p2.emit("matchmake", { type: "match_found", opponent: p1.id, vid: 2 });
    }
  }

  gameplayLoop() {
    console.log("matchmake service interval created.");
    setInterval(() => {
      this.sessionService.activeMatches.forEach((match, i) => {
        if ( match.status === MatchStatus.PLAYING ) {
          match.loop();
          match.player1.emit("gameplay::ball", match.ball.position);
          match.player2.emit("gameplay::ball", match.ball.position);

          match.player1.emit("gameplay::p1", match.player1.positionY);
          match.player2.emit("gameplay::p1", match.player1.positionY);

          match.player1.emit("gameplay::p2", match.player2.positionY);
          match.player2.emit("gameplay::p2", match.player2.positionY);
        }
      });
    }, 1000 / 60);
  }

  playerLeaves( player, reason ) {
    if ( player.matchId === null || player.tournament_id === -1 )
      return;
    const match = this.sessionService.activeMatches.get( player.matchId );
    if ( match === null )
      return;
    console.log("playerLeaves called for player id:", player.id, " reason:", reason);
    console.log("playerLeaves match id:", player.matchId, " tournament id:", player.tournament_id);
    this.sessionService.endMatch( player.matchId, reason );
    console.log("playerLeaves called for player id:", player.id, " reason:", reason, " match:", match);
  }
}

module.exports = { MatchmakerService };
