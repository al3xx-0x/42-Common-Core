const db = require('../db');
const blockUser = async (blockerId, blockedId) => {
    return new Promise((resolve, reject) => {
        if (blockerId === blockedId) {
            reject(new Error('Cannot block yourself'));
            return;
        }

        const query = `
            INSERT INTO BlockedUsers (blocker_id, blocked_id)
            VALUES (?, ?)
        `;

        db.run(query, [blockerId, blockedId], function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    reject(new Error('User is already blocked'));
                } else {
                    reject(err);
                }
            } else {
                resolve(true);
            }
        });
    });
};
const unblockUser = async (blockerId, blockedId) => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM BlockedUsers 
            WHERE blocker_id = ? AND blocked_id = ?
        `;

        db.run(query, [blockerId, blockedId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
};
const isUserBlocked = async (blockerId, blockedId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(*) as count
            FROM BlockedUsers 
            WHERE blocker_id = ? AND blocked_id = ?
        `;

        db.get(query, [blockerId, blockedId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
};

const getBlockedUsers = async (blockerId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT blocked_id
            FROM BlockedUsers 
            WHERE blocker_id = ?
        `;

        db.all(query, [blockerId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => row.blocked_id));
            }
        });
    });
};

const areUsersBlocked = async (user1Id, user2Id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(*) as count
            FROM BlockedUsers 
            WHERE (blocker_id = ? AND blocked_id = ?) 
               OR (blocker_id = ? AND blocked_id = ?)
        `;

        db.get(query, [user1Id, user2Id, user2Id, user1Id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
};

module.exports = {
    blockUser,
    unblockUser,
    isUserBlocked,
    getBlockedUsers,
    areUsersBlocked
};