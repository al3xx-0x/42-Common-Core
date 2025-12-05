const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const db_path = path.join(__dirname, '../', 'database/transcendence.db')

const db = new sqlite3.Database(db_path, (err) => {
	if (err) {
		console.error('DB: failed to connect', err.message);
	} else {
		console.log('DB: connected');

		try {
			const sql_path = path.join(__dirname, 'migrations', 'init.sql');
			const sql = fs.readFileSync(sql_path, 'utf8');
			db.exec(sql, (err) => {
				if (err) {
					console.warn('DB: could not apply migrations automatically:', err.message);
				} else {
					console.log('DB: schema ensured');
				}
			});
		} catch (error) {
			console.warn('DB: migration file not found:', error.message);
		}
	}
});

module.exports = db;
