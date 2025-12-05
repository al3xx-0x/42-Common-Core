const db = require('../db');

const addFirend = (user_id, friend_id) => {
	const sql = "INSERT INTO Friendships (user_id, friend_id, status) VALUES (?, ?, 'pending')";
	return new Promise((resolve, reject) => {
		db.run(sql, [user_id, friend_id], function (err) {
			if (err) reject (err);
			else resolve({ id: this.lastID, changes: this.changes });
		})
	})
}

const removeFirend = (user_id, friend_id) => {
	const sql = "DELETE FROM Friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)";
	return new Promise((resolve, reject) => {
		db.run(sql, [user_id, friend_id, friend_id, user_id], function (err) {
			if (err) reject (err);
			else resolve({ changes: this.changes });
		})
	})
}

const getFriends = (user_id) => {
	const sql = `
				SELECT
					U.id,
					U.first_name,
					U.last_name,
					U.username,
					U.profile_image
				FROM Friendships F
				JOIN Users U ON (
					(F.user_id = ? AND F.friend_id = U.id) OR
					(F.friend_id = ? AND F.user_id = U.id)
				)
				WHERE F.status = 'accepted';
	`;
	return new Promise((resolve, reject) => {
		db.all(sql, [user_id, user_id], function (err, rows) {
			if (err) reject(err);
			else resolve(rows);
		})
	})
}

const respondFriend = (sender, receiver, action) => {
	const updateQuery = `
		UPDATE Friendships
		SET status = ?
		WHERE (user_id = ? AND friend_id = ?)
			OR (user_id = ? AND friend_id = ?)
	`;

	const deleteQuery = `
		DELETE FROM Friendships
		WHERE (user_id = ? AND friend_id = ?)
			OR (user_id = ? AND friend_id = ?)
	`;

	return new Promise((resolve, reject) => {
		if (action === "accepted") {
			db.run(updateQuery, [action, sender, receiver, receiver, sender], function (err) {
				if (err) reject(err);
				else resolve({ message: "accepted", changes: this.changes });
			});
		}
		else if (action === "rejected") {
			db.run(deleteQuery, [sender, receiver, receiver, sender], function (err) {
				if (err) reject(err);
				else resolve({ message: "rejected", changes: this.changes });
			});
		}
		else {
			reject({ error: "Invalid action" });
		}
	});
};


const getRequests = (id) => {
	const query = `
		SELECT
			u.id,
			u.username,
			u.first_name,
			u.last_name,
			u.profile_image
		FROM Friendships f
		JOIN Users u ON f.user_id = u.id
		WHERE f.friend_id = ? AND f.status = 'pending'
	`;
	return new Promise((resolve, reject) => {
		db.all(query, [id], function (err, rows) {
			if (err) reject(err);
			else resolve(rows)
		})
	})
}

const getFriendshipStatus = (userId, targetId) => {
	const sql = `
		SELECT status
		FROM Friendships
		WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
		LIMIT 1;
	`;

	return new Promise((resolve, reject) => {
		db.get(sql, [userId, targetId, targetId, userId], (err, row) => {
			if (err) {
			reject(err);
			} else {
				resolve(row?.status ?? 'none');
			}
		});
	});
};


module.exports = {
	addFirend,
	getFriends,
	respondFriend,
	getFriendshipStatus,
	getRequests,
	removeFirend
};
