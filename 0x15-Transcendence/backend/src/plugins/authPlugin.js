const fp = require("fastify-plugin");
const {verifyAccess} = require('../utils/jwt')

const authPlugin = async (fastify) => {
	fastify.decorate('auth', async (req, reply) => {
		try {
			const authHeader = req.headers["authorization"];
			if (!authHeader) {
				return reply.code(401).send({ error: "Missing token" });
			}
			const token = authHeader.split(" ")[1];
			const decoded = await verifyAccess(token);
			req.user = decoded;
		} catch (error) {
			return reply.code(403).send({ error: "Invalid or expired token" });
		}
	})
}

module.exports = fp(authPlugin)
