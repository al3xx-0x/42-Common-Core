-- CREATE TABLE IF NOT EXISTS Users (
-- 	id INTEGER PRIMARY KEY AUTOINCREMENT,
-- 	name TEXT,
-- 	username TEXT UNIQUE,
-- 	google_id TEXT UNIQUE,
-- 	email TEXT NOT NULL UNIQUE,
-- 	password TEXT,
-- 	first_name TEXT,
-- 	last_name TEXT,
-- 	bio TEXT,
-- 	language TEXT DEFAULT 'en',
-- 	profile_image TEXT,
-- 	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT,
    google_id TEXT,
    email TEXT,
    password TEXT,
    profile_image TEXT DEFAULT '/uploads/default_profile_image.png',
    first_name TEXT,
    last_name TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    language TEXT DEFAULT 'en',
    cover TEXT DEFAULT '/uploads/default_cover.png',
    resetPasswordToken TEXT,
    resetPasswordExpire BIGINT,
    two_factor_enabled INTEGER DEFAULT 0,
    otp_code TEXT DEFAULT NULL,
    verified INTEGER DEFAULT 0,
    verification_code TEXT DEFAULT NULL,
    verification_expire_time BIGINT DEFAULT NULL,
    otp_expire_time bigint default null,
    score NUMBER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Friendships (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	friend_id INTEGER NOT NULL,
	status TEXT CHECK(status IN ('pending', 'accepted')) DEFAULT 'pending',
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES Users(id),
	FOREIGN KEY (friend_id) REFERENCES Users(id)
);


CREATE TABLE IF NOT EXISTS Messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	sender_id INTEGER NOT NULL,
	receiver_id INTEGER NOT NULL,
	message TEXT NOT NULL,
	is_read BOOLEAN DEFAULT 0,
	time DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (sender_id) REFERENCES Users(id),
	FOREIGN KEY (receiver_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Games (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	time DATETIME DEFAULT CURRENT_TIMESTAMP,
	player_1_id INTEGER NOT NULL,
	player_2_id INTEGER NOT NULL,
	player_1_goals INTEGER DEFAULT 0,
	player_2_goals INTEGER DEFAULT 0,
	winner_id INTEGER DEFAULT NULL,
	tournament_id INTEGER DEFAULT NULL,
	round INTEGER DEFAULT NULL,
	FOREIGN KEY (winner_id) REFERENCES Users(id),
	FOREIGN KEY (player_1_id) REFERENCES Users(id),
	FOREIGN KEY (player_2_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Tournaments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	time DATETIME DEFAULT CURRENT_TIMESTAMP,
	name TEXT NOT NULL,
	created_by INTEGER NOT NULL,
	status TEXT NULL DEFAULT "PENDING",
	prize_value INTEGER NOT NULL DEFAULT 3000
);

CREATE TABLE IF NOT EXISTS BlockedUsers (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	blocker_id INTEGER NOT NULL,
	blocked_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(blocker_id, blocked_id),
	FOREIGN KEY (blocker_id) REFERENCES Users(id) ON DELETE CASCADE,
	FOREIGN KEY (blocked_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('message', 'friend', 'invite', 'game', 'tournament')),
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    related_id INTEGER,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Logtime (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_name TEXT NOT NULL,
	user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_DATE,
	hours_logged INTEGER DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_notifications_receiver_read ON Notifications(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON Notifications(created_at);
