const db = require('../db');

const savedMessages = (sender_id, receiver_id, message) => {
    const sql = `INSERT INTO Messages(sender_id, receiver_id, message) VALUES (?, ?, ?)`;
    return new Promise ((resolve, reject) => {
        db.run(sql,[sender_id, receiver_id, message], function (err) {
            if (err) reject (err);
            else resolve ({
                id: this.lastID,
                from: Number(sender_id),
                to: Number(receiver_id),
                text: message,
                timestamp: new Date().toISOString(),
                is_read: false
            });
        })
    })
}


const getMessages = (sender_id, receiver_id, limit = 50) => {
    const sql = `SELECT * FROM Messages
        WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
        ORDER BY time ASC
        LIMIT ?`;
    return new Promise ((resolve, reject) => {
        db.all(sql, [sender_id, receiver_id, receiver_id, sender_id, limit], function(err, rows) {
            if (err) reject(err)
            else resolve (rows.map(row => ({
                id: row.id,
                from: Number(row.sender_id),
                to: Number(row.receiver_id),
                text: row.message,
                timestamp: row.time,
                isread: row.is_read
            })))
        })
    })
}

const markMessageRead = (sender_id, receiver_id) => {
    const sql = `UPDATE Messages
        SET is_read = TRUE
        WHERE sender_id = ? AND receiver_id = ? AND is_read= FALSE`
    return new Promise ((resolve, reject) => {
        db.run(sql,[sender_id, receiver_id], function (err) {
            if (err) reject (err)
            else resolve (this.changes)
        })
    })
}

const unreadMessagesCounter = (receiver_id) => {
    const sql = `SELECT sender_id, COUNT(*) AS unreadCount
                 FROM Messages 
                 WHERE receiver_id = ? AND is_read = 0
                 GROUP BY sender_id`;
    return new Promise((resolve, reject) => {
        db.all(sql, [receiver_id], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getAllUsers = (currentUserId) => {     
    const sql = `SELECT id, name, username, email FROM Users         
                 WHERE id != ?`
    return new Promise ((resolve, reject) => {         
        db.all(sql, [currentUserId], (err, rows) => {             
            if (err) reject (err)             
            else resolve (rows)         
        })     
    }) 
}
const getLastMessage = (sender_id, receiver_id) =>{
    const sql = `SELECT *
                FROM Messages
                WHERE (sender_id = ? AND receiver_id = ?)
                OR (sender_id = ? AND receiver_id = ?)
                ORDER BY time DESC
                LIMIT 1`
        return new Promise((resolve, reject) => {
            db.get(sql,[sender_id, receiver_id, receiver_id, sender_id], (err, row) => {
                if (err) reject (err)
                else resolve (row || null)
            })
        })
}
module.exports = {savedMessages, getMessages, markMessageRead, unreadMessagesCounter, getAllUsers, getLastMessage}