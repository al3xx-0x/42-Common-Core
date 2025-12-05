const { getUserGameHistory } = require('../models/game');
const calculateLevel = (xp) => {
	if (xp >= 16000) return 5;
	if (xp >= 8000) return 4;
	if (xp >= 4000) return 3; 
	if (xp >= 2000) return 2;
	if (xp >= 1000) return 1;
	return 1; 
};

const getGameHistory = async (req, reply) => {
	try {
		let { id } = req.query;
		if (!id) {
			id = req.user.id;
		}
		const games = await getUserGameHistory(id);
		const formattedGames = games.map(game => {
			const isPlayer1 = game.player_1_id == id;
			const isWinner = game.winner_id == id;
			const gameDate = new Date(game.date);
			const formattedDate = gameDate.toISOString().split('T')[0];
			const player1XP = game.p1_wins * 300;
			const player2XP = game.p2_wins * 300;
			const player1Level = calculateLevel(player1XP);
			const player2Level = calculateLevel(player2XP);
			const xp = isWinner ? 100 : 0;

			return {
				id: game.id,
				player: isPlayer1 ? game.player_1_username : game.player_2_username,
				opponent: isPlayer1 ? game.player_2_username : game.player_1_username,
				playerProfile: isPlayer1 ? game.player_1_profile : game.player_2_profile,
				opponentProfile: isPlayer1 ? game.player_2_profile : game.player_1_profile,
				score: isPlayer1 ? game.player_1_goals : game.player_2_goals,
				opponentScore: isPlayer1 ? game.player_2_goals : game.player_1_goals,
				result: game.winner_id === null ? 2 : (isWinner ? 1 : 0),
				date: formattedDate,
				xp: xp,
				playerlevel: isPlayer1 ? player1Level : player2Level,
				opponentlevel: isPlayer1 ? player2Level : player1Level,
			};
		});

		return reply.send({ games: formattedGames });
	} catch (error) {
		console.error("Game history error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
};

module.exports = { getGameHistory };
