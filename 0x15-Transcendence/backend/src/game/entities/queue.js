class PlayersQueue {

  constructor() {
    this.players = [];
  }

  add(player) {
    this.players.push(player);
  }

  remove(player) {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  popTwo() {
    if (this.players.length >= 2) {
      return [this.players.shift(), this.players.shift()];
    }
    return [];
  }
}

module.exports = { PlayersQueue };