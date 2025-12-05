const fastify = require('fastify')({logger: true});
const oauthPlugin = require('@fastify/oauth2');
const path = require('path');
const {getEnvFromVault} = require('./utils/vault');
require('dotenv').config();

let envVars = {};


fastify.register(require('@fastify/cors'), {
	origin:
	[
		"https://accounts.google.com",
		"https://e3r1p1.1337.ma"
	],
	allowedHeaders: ["Content-Type", "Authorization"],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: true,
});


fastify.register(require('@fastify/cookie'));

fastify.register(require('@fastify/multipart'), {
	limits: {
		fileSize: 2 * 1024 * 1024, // 2 MB max
	},
});

fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'uploads'),
	prefix: '/uploads/',
	decorateReply: false
});

fastify.register(require('./plugins/authPlugin'));

// Register unified socket service (handles both chat and game)
fastify.register(require('./socket'));
fastify.register(require('./chat/socket'));
fastify.register(require('./game/socket'));
// Remove the separate game socket registration since we'll use namespaces


// Routes
fastify.register(require('./routes/authRoutes'), {prefix: '/api/auth'});
fastify.register(require('./routes/userRoutes'), {prefix: '/api'});
fastify.register(require('./routes/notificationRoutes'), {prefix: '/api'});

const start = async function () {
	try {
		envVars = await getEnvFromVault()

		fastify.register(oauthPlugin, {
			name: 'googleOAuth2',
			scope: ['openid', 'email', 'profile'],
			credentials: {
			client: {
				id: envVars.GOOGLE_CLIENT_ID,
				secret: envVars.GOOGLE_CLIENT_SECRET
			},
			auth: require('@fastify/oauth2').GOOGLE_CONFIGURATION
			},
			startRedirectPath: '/api/login/google',
			callbackUri: (request) => {
				return `${envVars.SERVER_URL}/api/auth/login/google/callback`;
			},
			cookie: {
				secure: true,
				sameSite: 'lax',
				path: '/'
			}
		});



		const address = await fastify.listen({ port: envVars.PORT, host: '0.0.0.0' })
		fastify.log.info(`Server listening at ${address}`)
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

start();