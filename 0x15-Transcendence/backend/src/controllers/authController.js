const {
	createUser,
	getUserByEmail,
	getUserById,
	getUserByGoogleId,
	getUserByUsername,
	updateUserRestorations,
	getUserByToken,
	updatePassword,
	clearRestorationTokens,
	update2fa,
	saveHashedOtpCode,
	getUserOtpCode,
	clearOtpFields,
	getUserVerificationCode,
	clearVerificationFields,
	saveHashedVerificationCode,
	setEmailVerified
} = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { OAuth2Client } = require('google-auth-library');
const { signAccess, signRefresh, verifyAccess, verifyRefresh, decodeToken } = require('../utils/jwt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { log } = require('console');
const { maskEmail, replyWithJWT, generate2faCode } = require('../utils/utils');
const { request } = require('http');
const {getEnvFromVault} = require('../utils/vault');
const sendVerificationEmail = async (id, email) => {
	const verificationCode = crypto.randomInt(100000, 1000000).toString();
	const hashedVerificationCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

	const changes = await saveHashedVerificationCode(id, hashedVerificationCode, Date.now() + 10 * 60 * 1000);
	console.log(`changes => `, changes);

	await sendEmail({
		email,
		subject: 'Transcendence Email Verification Code',
		text: `Your verification code is: ${verificationCode}. It expires in 10 minutes. Please enter it to verify your email.`,
	});
}

//        ***************************

const register = async (req, reply) => {
	const {first_name, last_name, name, username, email, password, confirm_password} = req.body;
	const envVars = await getEnvFromVault();
	console.log(`Name: ${name}`);
	console.log(`Name: ${first_name}`);
	console.log(`Name: ${last_name}`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Confirm Password: ${confirm_password}`);
	// Check if a user is already exists by username and email
	const _username = await getUserByUsername(username);
	if (_username)
		return reply.code(409).send({"error": "Username already exists."});

	const _useremail = await getUserByEmail(email);
	if (_useremail)
		return reply.code(409).send({"error": "Email already exists."});

	if (password != confirm_password)
		return reply.code(400).send({"error": "Password and confirm password do not match."});
	try {
		const hashed = await hashPassword(password);
		const id = await createUser(first_name, last_name, name, username, email, hashed, null);

		await sendVerificationEmail(id, email);
		return reply.code(200).send (
			{message: 'Email Verification code sent your email.',
			userId: id,
			redirectTo: `${envVars.FRONTEND_URL}/auth/email/verify?email=${encodeURIComponent(email)}`
		});
	} catch (err) {
		if (err.message.includes("UNIQUE")) {
			return reply.code(409).send({ error: "Email or username already exists." });
		}
		console.error("Register error:", err.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

//        ***************************

const muskEmail = (email) => {
	const [localPart, domain] = email.split('@');
	const maskedLocalPart = localPart.length <= 2 ? localPart[0] + '*' : localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
	return `${maskedLocalPart}@${domain}`;
}

const login = async (req, reply) => {
	const {email, password} = req.body;
	const envVars = await getEnvFromVault();
	try {
		const user = await getUserByEmail(email);
		console.log("user => ", user);

		if (!user) {
			return reply.code(404).send({ error: "Email not registered" });
		}

		if (!user.verified && !user.google_id) {
			await sendVerificationEmail(user.id, email);
			return reply.code(403).send({
				message: 'Your email is not verified yet. Please check your inbox for the verification code.',
				userId: user.id
			});
		}

		// console.log("????, ", password, user.password);
		if ( user.google_id ) {
			return reply.code(400).send({ error: "Email already used!" });
		// 	return replyWithJWT(reply, user.id, user.username);
		}
		const match = await comparePassword(password, user.password);

		if (!match) {
			return reply.code(400).send({ error: "Email or password are not correct!" });
		}


		if (user.two_factor_enabled) {
			// const maskedEmail = maskEmail(email);
			const {verificationCode, hashedVerificationCode} = generate2faCode();
			console.log(`Generated 2FA code: ${verificationCode}, Hashed: ${hashedVerificationCode}`);

			await saveHashedOtpCode(user.id, hashedVerificationCode);

			await sendEmail({
				email: email,
				subject: 'Transcendence 2FA Verification Code',
				text: `Your verification code is: ${verificationCode}. Please enter this code to complete your login.`,
			});
			return reply.code(201).send({
				message: 'Email verification code sent to your email.',
				redirectTo: `${envVars.FRONTEND_URL}/auth/2fa/verify?email=${encodeURIComponent(email)}`
			});
		}
		return replyWithJWT(reply, user.id, user.username);

	} catch (error) {
		console.error("Login error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

//        ***************************

const refresh = async (req, reply) => {
	const {refreshToken} = req.cookies;
	if (!refreshToken)
		return reply.code(401).send({ error: 'Missing refresh token' });
	try {
		const payload = await verifyRefresh(refreshToken);
		const user = await getUserById(payload.id);
		const token = await signAccess({
			id: user.id,
			username: user.username
		});
		return reply.code(200).send({token})
	} catch (error) {
		return reply.code(403).send({ error: 'Invalid refresh token' });
	}
}

//        ***************************

const google = async (req, reply) => {
	console.log("....");
	const envVars = await getEnvFromVault();
	try {
		console.log('\n\nGoogle OAuth callback hit');
		const token = await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
		const client = new OAuth2Client(envVars.GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: token.token.id_token,
			audience: envVars.GOOGLE_CLIENT_ID
		});

		const googleUser = ticket.getPayload();
		const { sub, email, given_name, family_name} = googleUser;
		let username = given_name;
		const existingUser = await getUserByGoogleId(sub);

		if (!existingUser) {
			if (await getUserByUsername(username)) {
				username = `${username}${Date.now()}`
			}
			// first_name, last_name, name=null, username, email, password=null, google_id=null
			const id = await createUser(given_name, family_name, `${given_name} ${family_name}`, username, email, null, sub);
		}
		const user = await getUserByGoogleId(sub);
		if (!user) {
			return reply.code(500).send({error: "Failed to retrieve created user."});
		}
		const payload = {id: user.id, username: user.username};
		const accessToken = await signAccess(payload);
		if (!accessToken) {
			return reply.code(500).send({ error: "Failed to generate access token." });
		}
		const refreshToken = await signRefresh(payload)
		if (!refreshToken) {
			return reply.code(500).send({ error: "Failed to generate refresh token." });
		}
		console.log('req.headers.origin => ', req);
		return reply.setCookie('refreshToken',
			refreshToken,
			{
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 7 * 24 * 60 * 60,
			})
			.redirect(`${envVars.FRONTEND_URL}/auth/google/callback?token=${accessToken}`);
	} catch (error) {
		return reply.code(500).send({ error: "Internal server error." });
	}
}


//        ***************************

const forgotPassword = async (req, reply) => {
	const { email } = req.body;
	const envVars = await getEnvFromVault();
	try {
		const user = await getUserByEmail(email);
		// console.log("user => ", user);
		if (!user) {
			// Security tip: don't reveal if user exists
			return reply.code(404).send({ message: 'Cold not found the user !' });
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

		await updateUserRestorations(user.id, hashedToken, Date.now() + 10 * 60 * 1000);

		console.log("hooooooooooostname ", req.headers.origin);

		const resetUrl = `${envVars.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

		await sendEmail({
			email: user.email,
			subject: "Password Reset Request",
			text: `Click here to reset your password: ${resetUrl}`,
		});

		return reply.code(200).send({ message: 'Password reset link sent if email exists' });
	} catch (error) {
		console.error("Forgot password error:", error);
		return reply.code(500).send({ error: "Internal server error" });
	}
};

//        ***************************

const resetPassword = async (req, reply) => {
	const { token, new_password, confirm_password } = req.body;

	if (!token) {
		return reply.code(400).send({"error": "Missed token field."});
	}
	if (new_password !== confirm_password) {
		return reply.code(400).send({"error": "New password and confirm password do not match."});
	}

	try {
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

		const user = await getUserByToken(hashedToken);

		if (!user) {
			return reply.code(400).send({"error": "The token is invalid or expired."});
		}
		const hashedPassword = await hashPassword(new_password);

		await updatePassword(user.id, hashedPassword);

		await clearRestorationTokens();
		return reply.code(200).send({"message": "Password updated successfully"});
	} catch (error) {
		console.error("Reset password error:", error);
		return reply.code(500).send({ error: "Internal server error" });
	}
}

//        ***************************

const verify2fa = async (request, reply) => {
	const { otp_code, email } = request.body;

	if (!otp_code) {
		return reply.code(400).send({error: 'Missed opt code field !'});
	}

	if (!email) {
		return reply.code(400).send({error: 'Missed email field !'});
	}

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return reply.code(404).send({error: 'User not found !'});
		}
		const otpData = await getUserOtpCode(user.id);
		console.log('otpData => ', otpData.otp_code);
		if (!otpData || !otpData.otp_code) {
			return reply.code(400).send({error: 'OTP is not valid or has expired, Please request new one !'});
		}
		console.log(`opt_code => ${otpData.otp_code}`);
		const hashed_otp_code = crypto.createHash('sha256').update(otp_code).digest('hex');
		console.log(`hashed => ${hashed_otp_code}`);

		console.log(`#### => ${hashed_otp_code}|${otpData.otp_code}`);
		if (otpData.otp_code !== hashed_otp_code) {
			return reply.code(400).send({error: 'OTP is incorrect. Please try again.'});
		}
		await clearOtpFields(user.id);
		return replyWithJWT(reply, user.id, user.username);
	} catch (error) {
		console.error("2FA verification error:", error);
		return reply.code(500).send({ error: "Internal server error" });
	}
}

//        ***************************

const verifyEmail = async (request, reply) => {
	const { email, verification_code } = request.body;
	if (!verification_code) {
		return reply.code(400).send({error: 'Missed opt code field !'});
	}

	if (!email) {
		return reply.code(400).send({error: 'Missed email field !'});
	}

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return reply.code(404).send({error: 'User not found !'});
		}
		const verificationData = await getUserVerificationCode(user.id);
		console.log('verificationData => ', verificationData?.verification_code);
		if (!verificationData || !verificationData.verification_code) {
			return reply.code(400).send({error: 'OTP is not valid or has expired, Please request new one !'});
		}
		console.log('verification data => ', verificationData.verification_code);

		console.log(`opt_code => ${verificationData.verification_code}`);
		const hashed_verification_code = crypto.createHash('sha256').update(verification_code).digest('hex');

		console.log(`hashed => ${hashed_verification_code}`);
		console.log(`#### => ${hashed_verification_code}|${verificationData.verification_code}`);

		if (verificationData.verification_code !== hashed_verification_code) {
			return reply.code(400).send({error: 'Verification code is incorrect. Please try again.'});
		}
		await setEmailVerified(user.id, email);
		await clearVerificationFields(user.id);
		return reply.code(200).send({
			message: 'Email verified successfully.',
			userId: user.id
		});
	} catch (error) {
		console.error("Verification email error:", error);
		return reply.code(500).send({ error: "Internal server error" });
	}
}


const logout = async (req, reply) => {
	console.log("Logout called | cookies => ", req.cookies);
	reply.clearCookie('refreshToken', {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
	});
}

module.exports = {register, login, forgotPassword, resetPassword, refresh, google, verify2fa, verifyEmail, logout};
