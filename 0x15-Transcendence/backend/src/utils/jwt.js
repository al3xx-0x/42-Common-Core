const jwt = require('jsonwebtoken');
const { getEnvFromVault } = require('../utils/vault');

// Access Token
async function signAccess(payload) {
	try {
		const envVars = await getEnvFromVault();
		return jwt.sign(
			payload,
			envVars.secretKey,
			{expiresIn: envVars.expireTime}
		);
	} catch (error) {
		console.error('Error signing access token:', error);
		throw error;
	}
}

async function verifyAccess(token) {
	try {
		const envVars = await getEnvFromVault();
		// console.log("\n\nenvVars in verifyAccess jwt.js ", envVars);
		console.log("\n\ntoken in verifyAccess jwt.js ", token);
		return jwt.verify(token, envVars.secretKey);
	} catch (err) {
		throw new Error('Invalid token');
	}
}

// Refresh Token
async function signRefresh(payload) {
	try {
		const envVars = await getEnvFromVault();
		return jwt.sign(
			payload,
			envVars.refreshSecretKey,
			{expiresIn: envVars.refreshExpireTime}
		)
	} catch (error) {
		console.error('Error signing refresh token:', error);
		throw error;
	}
}

async function verifyRefresh(token) {
	try {
		const envVars = await getEnvFromVault();
		return jwt.verify(token, envVars.refreshSecretKey);
	} catch (err) {
		throw new Error('Invalid token');
	}
}

function decodeToken(token) {
	try {
		return jwt.decode(token);
	} catch (err) {
		throw new Error('Invalid token');
	}
}

module.exports =  {
	signAccess,
	signRefresh,
	verifyAccess,
	verifyRefresh,
	decodeToken
}
