const db = require('../db');

class NotificationModel {
    static async createNotification(type, content, senderId, receiverId, relatedId = null) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    INSERT INTO Notifications (type, content, sender_id, receiver_id, related_id, is_read, created_at)
                    VALUES (?, ?, ?, ?, ?, 0, datetime('now'))
                `;
                
                db.run(query, [type, content, senderId, receiverId, relatedId], function(err) {
                    if (err) {
                        console.error('Error creating notification:', err);
                        reject(err);
                        return;
                    }
                    
                    NotificationModel.getNotificationById(this.lastID)
                        .then(resolve)
                        .catch(reject);
                });
            } catch (error) {
                console.error('Error creating notification:', error);
                reject(error);
            }
        });
    }
    static async getNotificationById(id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT n.*, u.username as sender_username, u.profile_image as sender_profile_image
                    FROM Notifications n
                    JOIN Users u ON n.sender_id = u.id
                    WHERE n.id = ?
                `;
                
                db.get(query, [id], (err, row) => {
                    if (err) {
                        console.error('Error getting notification by ID:', err);
                        reject(err);
                        return;
                    }
                    resolve(row);
                });
            } catch (error) {
                console.error('Error getting notification by ID:', error);
                reject(error);
            }
        });
    }
    static async getNotificationsForUser(userId, limit = 50, offset = 0) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT n.*, u.username as sender_username, u.profile_image as sender_profile_image
                    FROM Notifications n
                    JOIN Users u ON n.sender_id = u.id
                    WHERE n.receiver_id = ?
                    ORDER BY n.created_at DESC
                    LIMIT ? OFFSET ?
                `;
                
                db.all(query, [userId, limit, offset], (err, rows) => {
                    if (err) {
                        console.error('Error getting notifications for user:', err);
                        reject(err);
                        return;
                    }
                    resolve(rows || []);
                });
            } catch (error) {
                console.error('Error getting notifications for user:', error);
                reject(error);
            }
        });
    }
    static async getUnreadNotificationsForUser(userId) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT n.*, u.username as sender_username, u.profile_image as sender_profile_image
                    FROM Notifications n
                    JOIN Users u ON n.sender_id = u.id
                    WHERE n.receiver_id = ? AND n.is_read = 0
                    ORDER BY n.created_at DESC
                `;
                
                db.all(query, [userId], (err, rows) => {
                    if (err) {
                        console.error('Error getting unread notifications:', err);
                        reject(err);
                        return;
                    }
                    resolve(rows || []);
                });
            } catch (error) {
                console.error('Error getting unread notifications:', error);
                reject(error);
            }
        });
    }
    static async markAsRead(notificationId, userId) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    UPDATE Notifications 
                    SET is_read = 1 
                    WHERE id = ? AND receiver_id = ?
                `;
                
                db.run(query, [notificationId, userId], function(err) {
                    if (err) {
                        console.error('Error marking notification as read:', err);
                        reject(err);
                        return;
                    }
                    resolve(this.changes > 0);
                });
            } catch (error) {
                console.error('Error marking notification as read:', error);
                reject(error);
            }
        });
    }
    static async markAllAsRead(userId) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    UPDATE Notifications 
                    SET is_read = 1 
                    WHERE receiver_id = ? AND is_read = 0
                `;
                
                db.run(query, [userId], function(err) {
                    if (err) {
                        console.error('Error marking all notifications as read:', err);
                        reject(err);
                        return;
                    }
                    resolve(this.changes);
                });
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
                reject(error);
            }
        });
    }
    static async deleteNotification(notificationId, userId) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    DELETE FROM Notifications 
                    WHERE id = ? AND receiver_id = ?
                `;
                
                db.run(query, [notificationId, userId], function(err) {
                    if (err) {
                        console.error('Error deleting notification:', err);
                        reject(err);
                        return;
                    }
                    resolve(this.changes > 0);
                });
            } catch (error) {
                console.error('Error deleting notification:', error);
                reject(error);
            }
        });
    }
    static async deleteAllNotifications(userId) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    DELETE FROM Notifications 
                    WHERE receiver_id = ?
                `;
                
                db.run(query, [userId], function(err) {
                    if (err) {
                        console.error('Error deleting all notifications:', err);
                        reject(err);
                        return;
                    }
                    resolve(this.changes);
                });
            } catch (error) {
                console.error('Error deleting all notifications:', error);
                reject(error);
            }
        });
    }
    static async getNotificationCount(userId, unreadOnly = false) {
        return new Promise((resolve, reject) => {
            try {
                let query = `
                    SELECT COUNT(*) as count 
                    FROM Notifications 
                    WHERE receiver_id = ?
                `;
                
                if (unreadOnly) {
                    query += ' AND is_read = 0';
                }
                
                db.get(query, [userId], (err, row) => {
                    if (err) {
                        console.error('Error getting notification count:', err);
                        reject(err);
                        return;
                    }
                    resolve(row ? row.count : 0);
                });
            } catch (error) {
                console.error('Error getting notification count:', error);
                reject(error);
            }
        });
    }
    static async cleanOldNotifications() {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    DELETE FROM Notifications 
                    WHERE created_at < datetime('now', '-30 days')
                `;
                
                db.run(query, [], function(err) {
                    if (err) {
                        console.error('Error cleaning old notifications:', err);
                        reject(err);
                        return;
                    }
                    console.log(`Cleaned ${this.changes} old notifications`);
                    resolve(this.changes);
                });
            } catch (error) {
                console.error('Error cleaning old notifications:', error);
                reject(error);
            }
        });
    }
}

module.exports = NotificationModel;