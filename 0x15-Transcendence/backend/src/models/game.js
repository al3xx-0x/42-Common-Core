const db = require('../db');

const createGame = async (player_1_id, player_2_id, winner_id, p1_goals, p2_goals) => {
	const sql = `INSERT INTO Games (player_1_id, player_2_id, player_1_goals, player_2_goals, winner_id) VALUES (?, ?, ?, ?, ?)`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[player_1_id, player_2_id, p1_goals, p2_goals, winner_id], function (err) {
			if (err) reject(err);
			else resolve(this.lastID);
		} )
	})
}

const getGameById = (id) => {
	const sql = `SELECT * FROM Games WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [id], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const createTournament = async ( tournament_name, created_by_id ) => {
	const sql = `INSERT INTO Tournaments ( name, created_by ) VALUES ( ?, ? )`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[tournament_name, created_by_id], function (err) {
			if (err) reject(err);
			else resolve(this.lastID);
		} )
	})
}

const destroyTournamentDB = async ( tournament_id ) => {
	const sql = `DELETE FROM Tournaments WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[tournament_id], function (err) {
			if (err) reject(err);
			else resolve(true);
		} )
	})
}


const updateTournamentStatus = ( id, status ) => {
	const sql = `UPDATE Tournaments SET status = ? WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[status, id], function (err) {
			if (err) reject(err);
			else resolve(true);
		} )
	})
}

const addScoreToPlayer = ( id, score ) => {
	const sql = `UPDATE Users SET score = score + ? WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[score, id], function (err) {
			if (err) reject(err);
			else resolve(true);
		} )
	})
}


const addPlayerToTournament = ( tournament_id ) => {
	const sql = `UPDATE Tournaments SET players_count = players_count + 1 WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[tournament_id], function (err) {
			if (err) reject(err);
			else resolve(true);
		} )
	})
}

const getTournaments = async ( from=0 ) => {
	if (from == -1) {
		const sql = `SELECT * FROM Tournaments ORDER BY id DESC`;
		return new Promise ((resolve, reject) => {
			db.all(sql, function (err, rows) {
				if (err) reject(err);
				else resolve(rows);
			})
		})
	}else {
		const sql = `SELECT * FROM Tournaments ORDER BY id DESC LIMIT 6 OFFSET ?`;
		return new Promise ((resolve, reject) => {
			db.all(sql,[from], function (err, rows) {
				if (err) reject(err);
				else resolve(rows);
			} )
		})
	}
}

const getTournamentsList = async (  ) => {
	const sql = `SELECT * FROM Tournaments WHERE status != "COMPLETED" ORDER BY id DESC`;
	return new Promise ((resolve, reject) => {
		db.all(sql, function (err, rows) {
			if (err) reject(err);
			else resolve(rows);
		})
	})
}

const getTournamentsHistory = async (  ) => {
	const sql = `SELECT * FROM Tournaments ORDER BY id DESC WHERE status == "COMPLETED"`;
	return new Promise ((resolve, reject) => {
		db.all(sql, function (err, rows) {
			if (err) reject(err);
			else resolve(rows);
		})
	})
}

const createTournamentGame = (player_1_id, player_2_id, winner_id, p1_goals, p2_goals, tournament_id, round ) => {
	const sql = `INSERT INTO Games (player_1_id, player_2_id, winner_id, player_1_goals, player_2_goals, tournament_id, round) VALUES (?, ?, ?, ?, ?, ?, ?)`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[player_1_id, player_2_id, winner_id, p1_goals, p2_goals, tournament_id, round], function (err) {
			if (err) reject(err);
			else resolve(this.lastID);
		} )
	})
}

const getTournamentGames = ( tournament_id ) => {
	const sql = `SELECT * FROM Games WHERE tournament_id = ?`;
	return new Promise ((resolve, reject) => {
		db.all(sql,[tournament_id], function (err, rows) {
			if (err) reject(err);
			else resolve(rows);
		} )
	})
}

const getTournamentById = (id) => {
	const sql = `SELECT * FROM Tournaments WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [id], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const getTournamentByName = async (name) => {
	const sql = `SELECT * FROM Tournaments WHERE name LIKE ? AND status != "COMPLETED"`;
	return new Promise ((resolve, reject) => {
		db.all(sql, [`%${name}%`], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const getTournamentByNameONLY_IDS = async (name) => {
	const sql = `SELECT id FROM Tournaments WHERE name LIKE ? AND status != "COMPLETED"`;
	return new Promise ((resolve, reject) => {
		db.all(sql, [`%${name}%`], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const getUserGameHistory = async (userId, limit = 50) => {
	const sql = `
		SELECT 
			g.id,
			g.time as date,
			g.player_1_id,
			g.player_2_id,
			g.player_1_goals,
			g.player_2_goals,
			g.winner_id,
			p1.username as player_1_username,
			p1.first_name as player_1_first_name,
			p1.last_name as player_1_last_name,
			p1.profile_image as player_1_profile,
			p2.username as player_2_username,
			p2.first_name as player_2_first_name,
			p2.last_name as player_2_last_name,
			p2.profile_image as player_2_profile,
			(SELECT COUNT(*) FROM Games WHERE (player_1_id = p1.id OR player_2_id = p1.id) AND winner_id IS NOT NULL) as p1_total_games,
			(SELECT COUNT(*) FROM Games WHERE winner_id = p1.id) as p1_wins,
			(SELECT COUNT(*) FROM Games WHERE (player_1_id = p2.id OR player_2_id = p2.id) AND winner_id IS NOT NULL) as p2_total_games,
			(SELECT COUNT(*) FROM Games WHERE winner_id = p2.id) as p2_wins
		FROM Games g
		LEFT JOIN Users p1 ON g.player_1_id = p1.id
		LEFT JOIN Users p2 ON g.player_2_id = p2.id
		WHERE (g.player_1_id = ? OR g.player_2_id = ?) 
		AND g.tournament_id IS NULL
		ORDER BY g.time DESC
		LIMIT ?
	`;
	return new Promise((resolve, reject) => {
		db.all(sql, [userId, userId, limit], function (err, rows) {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};

module.exports = { 
	createGame, 
	getGameById, 
	createTournament,
	destroyTournamentDB,
	updateTournamentStatus,
	createTournamentGame,
	getTournaments,
	addScoreToPlayer,
	getTournamentsList,
	getTournamentsHistory,
	getTournamentGames, 
	getTournamentById, 
	getTournamentByName, 
	getTournamentByNameONLY_IDS,
	getUserGameHistory 
};
