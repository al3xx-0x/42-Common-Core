const { profile,
	account,
	security,
	privacy,
	putIMG,
	deleteIMG,
	putCover,
	deleteAccount,
	twofa,
	search,
} = require('../controllers/settingsController');

const {removeFriendRequest} = require('../controllers/friendsController')
const {add, respond, friends, requests} = require('../controllers/friendsController');
const {getGameHistory} = require('../controllers/gameController');

async function userRoutes(fastify) {

	// Settings routes
	fastify.get('/settings/profile', {preHandler: [fastify.auth]}, profile);
	fastify.get('/search', {preHandler: [fastify.auth]}, search);
	fastify.put('/settings/account', {preHandler: [fastify.auth]}, account);
	fastify.put('/settings/security', {preHandler: [fastify.auth]}, security);
	fastify.post('/settings/2fa', {preHandler: [fastify.auth]}, twofa);
	fastify.put('/settings/privacy', {preHandler: [fastify.auth]}, privacy);
	fastify.put('/settings/image', {preHandler: [fastify.auth]}, putIMG);
	fastify.put('/settings/cover', {preHandler: [fastify.auth]}, putCover);
	fastify.delete('/settings/image', {preHandler: [fastify.auth]}, deleteIMG);
	fastify.delete('/settings/deleteAccount', {preHandler: [fastify.auth]}, deleteAccount);

	// Firends routes
	fastify.post('/friends/request/add', {preHandler: [fastify.auth]}, add);
	fastify.post('/friends/request/remove', {preHandler: [fastify.auth]}, removeFriendRequest);
	fastify.post('/friends/respond', {preHandler: [fastify.auth]}, respond);
	fastify.get('/friends', {preHandler: [fastify.auth]}, friends);
	fastify.get('/friends/requests', {preHandler: [fastify.auth]}, requests);

	// Game routes
	fastify.get('/game/history', {preHandler: [fastify.auth]}, getGameHistory);

}

module.exports = userRoutes;
