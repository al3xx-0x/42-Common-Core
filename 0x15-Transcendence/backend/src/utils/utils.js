const { signAccess, signRefresh } = require('../utils/jwt');
const crypto = require('crypto');

function maskEmail(email) {
	if (!email) return;
	const [name, domain] = email.split('@');
	const visible = name.slice(0, 3);
	const maskedEmail = `${visible}*****@${domain}`;
	return maskedEmail;
}

async function replyWithJWT(reply, user_id, username) {
	const payload = {
		id: user_id,
		username: username
	};
	const token = await signAccess(payload);
	if (!token) {
		return reply.code(500).send({ error: "Failed to generate access token." });
	}
	const refreshToken = await signRefresh(payload)
	if (!refreshToken) {
		return reply.code(500).send({ error: "Failed to generate refresh token." });
	}
	return reply.code(200).setCookie('refreshToken',
		refreshToken,
		{
			httpOnly: true,
			secure: true, // TODO: set true in production with HTTPS
			sameSite: 'strict',
			path: '/',
			maxAge: 7 * 24 * 60 * 60,
		}
		).send({
			message: 'Login successful.',
			token
	});
}

const generate2faCode = () =>  {
	const verificationCode = crypto.randomInt(100000, 1000000).toString();
	const hashedVerificationCode = crypto.createHash('sha256').update(verificationCode).digest('hex');
	return { verificationCode, hashedVerificationCode };
}

module.exports = {replyWithJWT, maskEmail, generate2faCode}