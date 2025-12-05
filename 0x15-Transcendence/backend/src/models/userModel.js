const { reject } = require('bcrypt/promises');
const db = require('../db');

const createUser = (first_name, last_name, name=null, username, email, password=null, google_id=null) => {
	const sql = `INSERT INTO Users (first_name, last_name, name, username, email, password, google_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
	return new Promise ((resolve, reject) => {
		db.run(sql,[first_name, last_name, name, username, email, password, google_id], function (err) {
			if (err) reject(err);
			else resolve(this.lastID);
		} )
	})
}

const getUserByEmail = (email) => {
	const sql = `SELECT id, verified, username, password, google_id, email, two_factor_enabled FROM Users WHERE email = ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [email], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const getUserById = (id) => {
	const sql = `SELECT id, google_id, username, password FROM Users WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [id], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const getUserByGoogleId = (google_id) => {
	const sql = `SELECT id, two_factor_enabled, username, password FROM Users WHERE google_id = ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [google_id], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const getUserByUsername = (username) => {
	const sql = `SELECT id, username, password FROM Users WHERE username = ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [username], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}


// settings part

const getProfile = (id) => {
	const sql = `SELECT id, username, google_id, score, email, first_name, last_name, bio, language, profile_image, two_factor_enabled, cover, created_at FROM Users WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [id], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const updateAccount = (id, first_name, last_name, bio) => {
	const sql = 'UPDATE Users SET first_name = ?, last_name = ?, bio = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [first_name, last_name, bio, id], function (err) {
			if (err) reject(err);
			else resolve(this.changes);
		})
	})
}

const updatePassword = async (id, password) => {
	const sql = 'UPDATE Users SET password = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [password, id], function (err) {
			if (err) reject(err);
			else {
				resolve(this.changes);
				console.log(`Password updated for user ${id}: ${password}`);
			}
		})
	})
}

const setEmailVerified = async (id, email) => {
	const query = 'update Users set verified = TRUE where id = ? and email = ?';
	return new Promise((resolve, reject) => {
		db.run(query, [id, email], function (error) {
			if (error)
				reject(error);
			else
				resolve(this.changes);
		});
	});
}


const update2fa = async (id, isEnabled) => {
	const query = 'update Users set two_factor_enabled = ? where id = ? AND google_id IS NULL';
	return new Promise((resolve, reject) => {
		db.run(query, [isEnabled, id], function (error) {
			if (error)
				reject(error);
			else
				resolve(this.changes);
		});
	});
}

const saveHashedOtpCode = async (id, otp_code) => {
	const otp_expire_time = Date.now() + 10 * 60 * 1000;
	const query = 'UPDATE Users SET otp_code = ?, otp_expire_time = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(query, [otp_code, otp_expire_time, id], function (error) {
			if (error)
				reject(error);
			else
				resolve(this.changes);
		});
	});
};


const saveHashedVerificationCode = async (id, verification_code, verification_expire_time) => {
	const query = 'UPDATE Users SET verification_code = ?, verification_expire_time = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(query, [verification_code, verification_expire_time, id], function (error) {
			if (error)
				reject(error);
			else
				resolve(this.changes);
		});
	});
};

const getUserOtpCode = async (id) => {
	const now = Date.now();
	const query = `SELECT otp_code FROM Users WHERE id = ? and otp_expire_time > ?`;
	return new Promise ((resolve, reject) => {
		db.get(query, [id, now], function (err, row) {
			if (err)
				reject(err);
			else
				resolve(row)
		})
	})
}

const getUserVerificationCode = async (id) => {
	const now = Date.now();
	const query = `SELECT verification_code FROM Users WHERE id = ? and verification_expire_time > ?`;
	return new Promise ((resolve, reject) => {
		db.get(query, [id, now], function (err, row) {
			if (err)
				reject(err);
			else
				resolve(row)
		})
	})
}

const clearOtpFields = async (id) => {
	const sql = `UPDATE Users SET otp_code = NULL, otp_expire_time = NULL WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.run(sql, [id], function (err) {
			if (err)
				reject(err);
			else
				resolve(this.changes)
		})
	})
}

const clearVerificationFields = async (id) => {
	const sql = `UPDATE Users SET verification_code = NULL, verification_expire_time = NULL WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.run(sql, [id], function (err) {
			if (err)
				reject(err);
			else
				resolve(this.changes)
		})
	})
}

const clearRestorationTokens = async (id) => {
	const sql = `UPDATE Users SET resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?`;
	return new Promise ((resolve, reject) => {
		db.run(sql, [id], function (err) {
			if (err)
				reject(err);
			else
				resolve(this.changes)
		})
	})
}


const updateUserGeneralInfo = (id, language) => {
	const sql = 'UPDATE Users SET language = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [language, id], function (err) {
			if (err) reject(err);
			else resolve(this.changes);
		})
	})
}

const updateImage = (id, filename) => {
	console.log("filename => ", filename);
	const sql = 'UPDATE Users SET profile_image = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [filename, id], function (err) {
			if (err)
				reject(err);
			else
				resolve(this.changes);
		})
	})
}


const getLogtimeOfToday = async (userid, date_today) => {
	const sql = 'SELECT hours_logged FROM Logtime WHERE user_id = ? AND created_at = ?';
	return new Promise((resolve, reject) => {
		db.get(sql, [userid, date_today], function (err, row) {
			if (err)
				reject(err);
			else
				resolve(row)
		})
	})
}

const updateLogtimeOfToday = async (userid, logged_time) => {
	const todayname = new Date().toLocaleString('en-US', { weekday: 'long' })
	const date_today = new Date().toISOString().split('T')[0]
	const LogtimeOfToday = await getLogtimeOfToday(userid, date_today);

	if (!LogtimeOfToday) {
		const insertSql = 'INSERT INTO Logtime (day_name, user_id, hours_logged) VALUES (?, ?, ?)';
		return new Promise((resolve, reject) => {
			db.run(insertSql, [todayname, userid, logged_time], function (err) {
				if (err)
					reject(err);
				else
					resolve(this.lastID);
			})
		});
	}

	const sql = 'UPDATE Logtime SET hours_logged = hours_logged + ? WHERE user_id = ? AND created_at = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [logged_time, userid, date_today], function (err) {
			if (err)
				reject(err);
			else
				resolve(this.changes);
		})
	})
}

const updateCover = async (id, filename) => {
	console.log("filename => ", filename);
	const sql = 'UPDATE Users SET cover = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [filename, id], function (err) {
			if (err)
				reject(err);
			else
				resolve(this.changes);
		})
	})
}

const getLogtimeofUserWeek = async (userId) => {
	const sql = 'SELECT day_name as day, hours_logged as time FROM Logtime WHERE created_at >= DATE(\'now\', \'-6 days\') AND created_at <= DATE(\'now\') AND user_id = ?;';
	return new Promise((resolve, reject) => {
		db.all(sql, [userId], function (err, rows) {
			if (err)
				reject(err);
			else
				resolve(rows)
		})
	})
}

const deleteImage = async (id) => {
	const sql = 'UPDATE Users SET profile_image = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [null, id], function (err) {
			if (err) reject(err);
			else resolve(this.changes);
		})
	})
}

const deleteUser = async (id) => {
	const sql = 'DELETE FROM Users WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [id], function(err) {
		if (err) reject(err);
		else resolve(this.changes);
		});
	});
};


const updateUserRestorations = async (id, resetPasswordToken, resetPasswordExpire) => {
	const sql = 'UPDATE Users SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.run(sql, [resetPasswordToken, resetPasswordExpire, id], function (err) {
			if (err) reject(err);
			else resolve(this.changes);
		});
	});
}

const getUserByToken = async (token) => {
	const sql = `SELECT id, resetPasswordExpire, resetPasswordToken FROM Users WHERE resetPasswordToken = ? AND resetPasswordExpire > ?`;
	return new Promise ((resolve, reject) => {
		db.get(sql, [token, Date.now()], function (err, row) {
			if (err) reject(err);
			else resolve(row)
		})
	})
}

const searchForUser = async (id, word) => {
	const query = `
			SELECT id, username, email, first_name, last_name, bio, language, profile_image, two_factor_enabled, cover, created_at
			FROM Users where (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?) AND id != ?
	`;
	const serchTerm = `%${word}%`;

	return new Promise ((resolve, reject) => {
		db.all(query, [serchTerm, serchTerm, serchTerm, id], function (err, rows) {
			if (err) reject(err);
			else resolve(rows)
		})
	})
}

const getUserStats = async (userId) => {
	const query = `
		SELECT
			(SELECT COUNT(*) from Games WHERE player_1_id = :id OR player_2_id = :id) as match_count,
			(SELECT COUNT(*) from Games WHERE winner_id = :id) as win_count,
			(SELECT COUNT(*) from Games WHERE (player_1_id = :id OR player_2_id = :id) AND winner_id != :id) as lose_count,
			(SELECT COUNT(*) from Friendships WHERE status = 'accepted' AND (user_id = :id OR friend_id = :id)) as friends_count
	`;
	return new Promise((resolve, reject) => {
		db.get(query, {':id': userId}, function (err, row) {
			if (err) reject(err);
			else resolve (row);
		});
	})
}

const getLeaderboard = async () => {
	const query = `
		SELECT
			U.id,
			U.username,
			U.profile_image,
			U.score,
			CASE
                WHEN U.score / 1000 > 5 THEN 5
                ELSE U.score / 1000
			END AS lvl,
			COUNT(G.id) AS win_count
		FROM Users U
		LEFT JOIN Games G ON G.winner_id = U.id
		GROUP BY U.id
		ORDER BY score DESC
		LIMIT 10;
	`;
	return new Promise((resolve, reject) => {
		db.all(query, [], (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};



module.exports = {
	createUser,
	getUserByEmail,
	getUserById,
	getUserByGoogleId,
	getUserByUsername,
	getProfile,
	updateAccount,
	updatePassword,
	updateUserGeneralInfo,
	updateImage,
	deleteImage,
	updateCover,
	deleteUser,
	updateUserRestorations,
	getUserByToken,
	clearRestorationTokens,
	update2fa,
	saveHashedOtpCode,
	getUserOtpCode,
	clearOtpFields,
	getUserVerificationCode,
	clearVerificationFields,
	saveHashedVerificationCode,
	setEmailVerified,
	searchForUser,
	getUserStats,
	getLeaderboard,



	updateLogtimeOfToday,
	getLogtimeofUserWeek
};
