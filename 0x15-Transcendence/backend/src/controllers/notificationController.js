const NotificationModel = require('../models/notificationModel');

const getNotifications = async (req, reply) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const notifications = await NotificationModel.getNotificationsForUser(userId, limit, offset);
        const formattedNotifications = notifications.map(notification => ({
            id: notification.id,
            type: notification.type,
            content: notification.content,
            sender_id: notification.sender_id,
            receiver_id: notification.receiver_id,
            related_id: notification.related_id,
            timestamp: notification.created_at,
            read: notification.is_read === 1,
            sender_username: notification.sender_username,
            sender_profile_image: notification.sender_profile_image
        }));

        return reply.code(200).send({
            success: true,
            notifications: formattedNotifications,
            count: formattedNotifications.length
        });
    } catch (error) {
        console.error('Error getting notifications:', error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};
const getUnreadNotifications = async (req, reply) => {
    try {
        const userId = req.user.id;
        const notifications = await NotificationModel.getUnreadNotificationsForUser(userId);
        const formattedNotifications = notifications.map(notification => ({
            id: notification.id,
            type: notification.type,
            content: notification.content,
            sender_id: notification.sender_id,
            receiver_id: notification.receiver_id,
            related_id: notification.related_id,
            timestamp: notification.created_at,
            read: false,
            sender_username: notification.sender_username,
            sender_profile_image: notification.sender_profile_image
        }));

        return reply.code(200).send({
            success: true,
            notifications: formattedNotifications,
            count: formattedNotifications.length
        });
    } catch (error) {
        console.error('Error getting unread notifications:', error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

const markAsRead = async (req, reply) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!id) {
            return reply.code(400).send({ error: 'Notification ID is required' });
        }

        const success = await NotificationModel.markAsRead(parseInt(id), userId);
        
        if (success) {
            return reply.code(200).send({ success: true, message: 'Notification marked as read' });
        } else {
            return reply.code(404).send({ error: 'Notification not found or not authorized' });
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

const markAllAsRead = async (req, reply) => {
    try {
        const userId = req.user.id;
        const updatedCount = await NotificationModel.markAllAsRead(userId);
        
        return reply.code(200).send({ 
            success: true, 
            message: `${updatedCount} notifications marked as read` 
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

const deleteNotification = async (req, reply) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!id) {
            return reply.code(400).send({ error: 'Notification ID is required' });
        }

        const success = await NotificationModel.deleteNotification(parseInt(id), userId);
        
        if (success) {
            return reply.code(200).send({ success: true, message: 'Notification deleted' });
        } else {
            return reply.code(404).send({ error: 'Notification not found or not authorized' });
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

const deleteAllNotifications = async (req, reply) => {
    try {
        const userId = req.user.id;
        const deletedCount = await NotificationModel.deleteAllNotifications(userId);
        
        return reply.code(200).send({ 
            success: true, 
            message: `${deletedCount} notifications deleted` 
        });
    } catch (error) {
        console.error('Error deleting all notifications:', error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

const getNotificationCount = async (req, reply) => {
    try {
        const userId = req.user.id;
        const unreadOnly = req.query.unread === 'true';
        
        const count = await NotificationModel.getNotificationCount(userId, unreadOnly);
        
        return reply.code(200).send({ 
            success: true, 
            count: count,
            unread_only: unreadOnly 
        });
    } catch (error) {
        console.error('Error getting notification count:', error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
};

module.exports = {
    getNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    getNotificationCount
};