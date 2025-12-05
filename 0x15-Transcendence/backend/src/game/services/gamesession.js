const { MatchStatus } = require("../entities/match");
const { PlayerStatus } = require("../entities/player");

const { createGame, addScoreToPlayer, createTournamentGame } = require("../../models/game")

class GameSessionService {
  constructor() {
    this.activeMatches = new Map();
  }

  addMatch(match) {
    this.activeMatches.set(match.id, match);
  }

  async endMatch(matchId, reason) {
    const match = this.activeMatches.get(matchId);
    if (!match) return;

    console.log("match ended so disconnect");

    const { player1, player2, timer } = match;

    if ( match.status === MatchStatus.PLAYING ) {
      console.log("anyway you wiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiin");
      // console.log("Creating game with:", {
      //     p1: player1?.id,
      //     p2: player2?.id,
      //     winner: player1.status !== PlayerStatus.IDLE ? player1.id : player2.id,
      //     p1Goals: player1?.goals,
      //     p2Goals: player2?.goals
      //   });

      if (player1.status !== PlayerStatus.IDLE) {
            match.player1_goals = 3;
            match.player2_goals = 0;
            player1.emit("gameplay::onGoal", {id: player1.id, vid: 1, goals: match.player1_goals, opponent_goals: match.player2_goals});
            player1.emit("gameplay::onEnd", true);


            console.log("match cancelled by player2>", player2.id);
            match.status = MatchStatus.COMPLETED;

            if ( match.tournament_instance !== null) {
              match.winner = match.player1;
              match.tournament_instance.someOneWins(match, match.player1, match.player2);
              createTournamentGame(player1.id, player2.id, player1.id, match.player1_goals, match.player2_goals, match.tournament_instance.id, match.tournament_instance.round).then( game => {
                console.log("Created TOURNAMENT game in DB:", game, " winner is :", player1.id);
              });
            }else{
              createGame(player1.id, player2.id, player1.id, match.player1_goals, match.player2_goals).then( game => {
                console.log("Created game in DB:", game, " winner is :", player1.id);
                addScoreToPlayer( player1.id, 100 ).then( () => {
                    console.log("Points ", 100, "of normal game added to player id:", player1.id);
                });
              });
            }
            // console.log("Created game in DB:", game, " winner is :", player1.id);
            // player1.socket.emit("matchmake", { type: "opponent_left" });
    
        }
        if (player2.status !== PlayerStatus.IDLE) {
            match.player1_goals = 0;
            match.player2_goals = 3;
            player2.emit("gameplay::onGoal", {id: player1.id, vid: 1, goals: match.player2_goals, opponent_goals: match.player1_goals});
            player2.emit("gameplay::onEnd", true);

            console.log("match cancelled by player1>", player1.id);
            match.status = MatchStatus.COMPLETED;

            if ( match.tournament_instance !== null) {
                match.winner = match.player2;
                match.tournament_instance.someOneWins(match, match.player2, match.player1);
                createTournamentGame(player1.id, player2.id, player2.id, match.player1_goals, match.player2_goals, match.tournament_instance.id, match.tournament_instance.round).then( game => {
                  console.log("Created TOURNAMENT game in DB:", game, " winner is :", player1.id);
                });
            }else{
                createGame(player1.id, player2.id, player2.id, match.player1_goals, match.player2_goals).then( game => {
                  console.log("Created game in DB:", game, " winner is :", player2.id);
                  addScoreToPlayer( player2.id, 100 ).then( () => {
                      console.log("Points ", 100, "of normal game added to player id:", player2.id);
                  });
                });
            }    
      }
      return;
    }

    if (reason === "left" || reason === "disconnect") {
      console.log(`player1.socket ${player1.socket} | player1.socket.connected ${player1.socket.connected}`);

        if (player1.socket && player1.socket.connected) {
            player1.emit("matchmake", { type: "opponent_left" });
            console.log("match ended so 2 exited>", player1.socket.connected);

            if ( match.tournament_instance !== null) {
              console.log("player 2 left the match, so player 1 wins by default");
              match.winner = match.player1;
              match.tournament_instance.someOneWins(match, match.player1, match.player2);
            }
        }else
        if (player2.socket && player2.socket.connected) {
          player2.emit("matchmake", { type: "opponent_left" });
          console.log("match ended so 1 exited>", player2.socket.connected);
          
          if ( match.tournament_instance !== null) {
            console.log("player 1 left the match, so player 2 wins by default");
            match.winner = match.player2;
            match.tournament_instance.someOneWins(match, match.player2, match.player1);
          }
        }
        // sf if the opponent left play with him and win or do anything you want,
        // there no bot for the leaved opponent ;) so it's ez to win
        // return;
      }
      player1.status = "idle";
      player2.status = "idle";
      
      player1.matchId = null;
      player2.matchId = null;
      
      console.log("clearning interval>>>>>>>>>>> :", timer);
      clearTimeout(timer);
      
      match.status = MatchStatus.COMPLETED;
    if ( match.tournament_instance === null ) 
      this.activeMatches.delete(matchId);
  }
}

module.exports = { GameSessionService };