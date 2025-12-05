const notificationController = require('../controllers/notificationController');

async function notificationRoutes(fastify, options) {
    fastify.get('/notifications', {
        preHandler: [fastify.auth]
    }, notificationController.getNotifications);
    fastify.get('/notifications/unread', {
        preHandler: [fastify.auth]
    }, notificationController.getUnreadNotifications);

    fastify.get('/notifications/count', {
        preHandler: [fastify.auth]
    }, notificationController.getNotificationCount);

    fastify.put('/notifications/:id/read', {
        preHandler: [fastify.auth]
    }, notificationController.markAsRead);

    fastify.put('/notifications/read-all', {
        preHandler: [fastify.auth]
    }, notificationController.markAllAsRead);

    fastify.delete('/notifications/:id', {
        preHandler: [fastify.auth]
    }, notificationController.deleteNotification);

    fastify.delete('/notifications/all', {
        preHandler: [fastify.auth]
    }, notificationController.deleteAllNotifications);
}

module.exports = notificationRoutes;