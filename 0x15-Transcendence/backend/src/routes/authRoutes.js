const {registerSch, loginSch, restSch, forgotSch} = require('../schemas/authSch');
const {
	register,
	login,
	refresh,
	google,
	forgotPassword,
	resetPassword,
	verify2fa,
	verifyEmail,
	logout
} = require('../controllers/authController');

const authRoutes = async (fastify) => {
	fastify.post('/register', {schema: registerSch}, register);
	fastify.post('/login', {schema: loginSch}, login);
	fastify.post('/logout', logout);
	fastify.post('/forgot-password', {schema: forgotSch}, forgotPassword);
	fastify.post('/reset-password', {schema: restSch}, resetPassword);
	fastify.post('/2fa/verify', verify2fa);
	fastify.post('/email/verify', verifyEmail);
	fastify.post('/refresh', refresh);
	fastify.get('/login/google/callback', google);
}

module.exports = authRoutes
