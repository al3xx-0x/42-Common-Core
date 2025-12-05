const { default: fastify } = require("fastify");
const { Point, randomrange } = require("./point");
const { Ball } = require("./ball");
const { createGame, getGameById, updateGameStatus, createTournamentGame, addScoreToPlayer } = require("../../models/game")

const WIN_GOALS = 3;
const PRIZE_SCORE = 100;
const BOARD_WIDTH = 960;
const BOARD_HEIGHT = 640;

const MatchStatus = {
    PENDING: "pending",
    PLAYING: "playing",
    PAUSED: "paused",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
}

class Match {
  constructor(id, player1, player2, tournament_id = null, round_id = null, tournament_instance = null) {
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;

    this.player1_goals = 0;
    this.player2_goals = 0;

    this.winner = null;
    this.status = MatchStatus.PENDING;
    this.ready = false;
    this.timer_to_start = null;
    this.tournament_id = tournament_id;
    this.round_id = round_id;
    this.ball = new Ball(new Point(BOARD_WIDTH /2, BOARD_HEIGHT /2), 20);

    this.tournament_instance = tournament_instance;
  }


  collision_detection() {
    if ( this.ball.position.x - this.ball.radius < 20
      && (this.ball.position.y <= this.player1.positionY + this.player1.scale.y && this.ball.position.y >= this.player1.positionY

        && this.ball.position.y + this.ball.radius >= this.player1.positionY
        && this.ball.position.y - this.ball.radius <= this.player1.positionY + this.player1.scale.y
      ) ) {
        // this.ball.velocity.x *= -1;
        var ballPosY = this.ball.position.y - this.player1.positionY;
        ballPosY -= this.player1.scale.y /2;
        this.ball.velocity.x = Math.abs(this.ball.velocity.x);
        this.ball.velocity.y = (ballPosY * 0.1);
      }

    if ( this.ball.position.x + this.ball.radius > BOARD_WIDTH - 20
      && (this.ball.position.y <= this.player2.positionY + this.player2.scale.y && this.ball.position.y >= this.player2.positionY

        && this.ball.position.y + this.ball.radius >= this.player2.positionY
        && this.ball.position.y - this.ball.radius <= this.player2.positionY + this.player2.scale.y

      ) ) {
        // this.ball.velocity.x *= -1;
        var ballPosY = this.ball.position.y - this.player2.positionY;
        ballPosY -= this.player2.scale.y /2;
        this.ball.velocity.x = -Math.abs(this.ball.velocity.x);
        this.ball.velocity.y = (ballPosY * 0.1);
    }

    // LEFT paddle handleee hunging
    if (
      this.ball.position.x - this.ball.radius < 20 &&
      this.ball.position.y + this.ball.radius >= this.player1.positionY &&
      this.ball.position.y - this.ball.radius <= this.player1.positionY + this.player1.scale.y
    ) {
      const ballPosY = this.ball.position.y - this.player1.positionY - this.player1.scale.y / 2;
      this.ball.velocity.x = Math.abs(this.ball.velocity.x);
      this.ball.velocity.y = ballPosY * 0.1;

      // pushingg ball outside paddle to avoid sticking inside the paddle
      this.ball.position.x = 20 + this.ball.radius;
    }

    // Right paddle handleee hunging
    if (
      this.ball.position.x + this.ball.radius > BOARD_WIDTH - 20 &&
      this.ball.position.y + this.ball.radius >= this.player2.positionY &&
      this.ball.position.y - this.ball.radius <= this.player2.positionY + this.player2.scale.y
    ) {
      const ballPosY = this.ball.position.y - this.player2.positionY - this.player2.scale.y / 2;
      this.ball.velocity.x = -Math.abs(this.ball.velocity.x);
      this.ball.velocity.y = ballPosY * 0.1;

      // pushingg ball outside paddle to avoid sticking inside the paddle
      this.ball.position.x = BOARD_WIDTH - 20 - this.ball.radius;
    }
  }

  input_handle() {
    if ( this.player1.key_up && this.player1.positionY > 0 ) {
      this.player1.positionY -= this.ball.speed * 1.3;
    }

    if ( this.player1.key_down && this.player1.positionY + this.player1.scale.y < BOARD_HEIGHT ) {
      this.player1.positionY += this.ball.speed * 1.3;
    }

    if ( this.player2.key_up && this.player2.positionY > 0 ) {
      this.player2.positionY -= this.ball.speed * 1.3;
    }

    if ( this.player2.key_down && this.player2.positionY + this.player2.scale.y < BOARD_HEIGHT ) {
      this.player2.positionY += this.ball.speed * 1.3;
    }
  }

  loop() {
    this.ball.position.x += this.ball.velocity.x;

    this.input_handle();
    this.collision_detection();



    // p1 makes a goal
    if ( this.ball.position.x + this.ball.radius  > BOARD_WIDTH ) {
      // this.ball = new Ball(new Point(BOARD_WIDTH /2, BOARD_HEIGHT /2), 20);
      this.ball.direction = new Point(-1, 0);
      this.ball.velocity = new Point( this.ball.direction.x * this.ball.speed, this.ball.direction.y * this.ball.speed );
      this.ball.position = new Point(BOARD_WIDTH /2, this.player1.positionY + this.player1.scale.y /2);
      // this.ball.velocity = new Point(randomrange(-10, 10));
      console.log(":GAMEPLAY: player 1 makes a goal", this.ball);
      this.player1_goals += 1;
      this.player1.emit("gameplay::onGoal", {id: this.player1.id, vid: 1, goals: this.player1_goals, opponent_goals: this.player2_goals});
      this.player2.emit("gameplay::onGoal", {id: this.player1.id, vid: 1, goals: this.player2_goals, opponent_goals: this.player1_goals});

      if ( this.player1_goals >= WIN_GOALS ) {
        this.winner = this.player1;
        this.match_someOneWins();
      }

    }

    // p2 makes a goal
    if ( this.ball.position.x - this.ball.radius < 0 ) {
      // this.ball = new Ball(new Point(BOARD_WIDTH /2, BOARD_HEIGHT /2), 20);
      this.ball.direction = new Point(1, 0);
      this.ball.velocity = new Point( this.ball.direction.x * this.ball.speed, this.ball.direction.y * this.ball.speed );
      this.ball.position = new Point(BOARD_WIDTH /2, this.player2.positionY + this.player2.scale.y /2);
      console.log(":GAMEPLAY: player 2 makes a goal", this.ball);
      this.player2_goals += 1;
      this.player1.emit("gameplay::onGoal", {id: this.player2.id, vid: 2,  goals: this.player1_goals, opponent_goals: this.player2_goals});
      this.player2.emit("gameplay::onGoal", {id: this.player2.id, vid: 2,  goals: this.player2_goals, opponent_goals: this.player1_goals});

      if ( this.player2_goals >= WIN_GOALS ) {
        this.winner = this.player2;
        this.match_someOneWins();
      }
      // this.ball.velocity.x *= -1;
    }

    this.ball.position.y += this.ball.velocity.y;
    if ( this.ball.position.y + this.ball.radius > BOARD_HEIGHT || this.ball.position.y - this.ball.radius < 0 )
      this.ball.velocity.y *= -1;
  }

  match_someOneWins() {
    const winner = this.winner;
    const winner_opponent = (winner.id === this.player1.id) ? this.player2 : this.player1;

    winner.emit("gameplay::onEnd", true);
    winner_opponent.emit("gameplay::onEnd", false);

    console.log("Match id:", this.id, " ended. Winner is player id:", winner.id);

    if ( this.tournament_instance !== null) {

      createTournamentGame(this.player1.id, this.player2.id, winner.id, this.player1_goals, this.player2_goals, this.tournament_id, this.round_id).then( game => {
          console.log("Created TOURNAMENT game in DB:", game, " winner is :", winner.id);
        });

        this.tournament_instance.someOneWins(this, winner, winner_opponent);
      }
      else {
        createGame(this.player1.id, this.player2.id, winner, this.player1_goals, this.player2_goals).then( game => {
          console.log("Created game in DB:", game, " winner is :", winner.id);
          addScoreToPlayer( winner.id, PRIZE_SCORE ).then( () => {
              console.log("Points ", PRIZE_SCORE, "of normal game added to player id:", winner.id);
          });
        });
    }

    this.status = MatchStatus.COMPLETED;
  }
}

module.exports = { Match, MatchStatus, BOARD_HEIGHT, BOARD_WIDTH };
