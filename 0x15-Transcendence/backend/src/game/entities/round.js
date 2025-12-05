const { getProfile } = require("../../models/userModel");

class Round {
	constructor( round_id ) {
		this.round_id = round_id;
		this.players = [];
		this.winners = [];
		this.matches = new Map();
		this.completed = false;
		this.matches_completed = 0;
	}
	
	addMatch( id, match ) {
		console.log("setting match id :", id, " in round :", this.round_id, " to ", match );
		this.matches.set( id, match );
		this.matches_completed++;
	}
	
	endMatch( id ) {
		// this.matches.delete( id );
		this.matches_completed--;
		if ( this.matches_completed === 0 ) {
			this.markCompleted();
		}
	}

	markCompleted() {
		this.completed = true;
	}

	async getPlayersData() {
		const players_data = []
		for ( const p of this.players ) {
			if ( p === null ) {
				players_data.push( null );
			}else {
				const pdata =  await getProfile( p.id );
				pdata.alias = p.alias;
				players_data.push( pdata );
			}
		}
		return players_data;
	}
}

module.exports = { Round };