const {
	getProfile,
	updateAccount,
	getUserById,
	updatePassword,
	updateUserGeneralInfo,
	updateImage,
	deleteImage,
	updateCover,
	deleteUser,
	update2fa,
	searchForUser,
	getUserStats,
	getLeaderboard,
	getLogtimeofUserWeek
} = require('../models/userModel');

const { hashPassword, comparePassword } = require('../utils/hash');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { error } = require('console');
const { getFriends, getFriendshipStatus } = require('../models/friendsModel');

const profile = async (req, reply) => {
	try {
		let {id} = req.query
		// console.log('id :=> ', id);
		if (!id)
			id = req.user.id;
		// console.log('id :=> ', id);
		let profile = await getProfile(id);
		const logtime = await getLogtimeofUserWeek(id);


		if (!profile)
			return reply.code(404).send({error: 'User not found'});

		let friendship_status = "none";
		if (id != req.user.id) {
			friendship_status = await getFriendshipStatus(id, req.user.id);
			console.log('friendship_status => ', friendship_status);
			if (!friendship_status) {
				friendship_status = "none"
			}
		}
		const userStats = await getUserStats(id);
		const leaderboard = await getLeaderboard(id);

		const date = new Date(profile.created_at);
		const formatted = date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
		if ( profile.score > 5000 ) profile.score = 5000;
		const lvl = parseInt(profile.score /1000);
		profile = {
			...profile,
			created_at: formatted,
			...userStats,
			leaderboard: leaderboard,
			friendship_status: friendship_status,
			lvl,
			xp: profile.score,
			logtime: logtime,
			isGoogleLogin: profile.google_id ? true : false,
		}
		console.log("logtime gettt>>>>>>", profile.logtime);

		let winRate = 0;

		if (profile.match_count > 0) {
			winRate = ((profile.win_count / profile.match_count ) * 100).toFixed(2);
		}

		profile = {
			...profile,
			win_rate: winRate,
			alias: null
		}

		// if (id != req.user.id) console.log("USER => ", profile);
		return reply.send({user: profile});
	} catch (error) {
		console.error("Setting error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const account = async (req, reply) => {
	try {
		console.log(`body => ${req.body}`);
		const {first_name, last_name, bio} = req.body;
		if (!first_name) {
			return reply.code(400).send({error: 'Missed first_name'});
		}
		if (!last_name) {
			return reply.code(400).send({error: 'Missed last_name'});
		}

		// if (!bio) {
		// 	return reply.code(400).send({error: 'Missed bio'});
		// }
		console.log(`first_name => ${first_name} | last_name => ${last_name} | bio ${bio}`);
		const changes = await updateAccount(req.user.id, first_name, last_name, bio);
		return reply.code(201).send({changes: changes, success: true});
	} catch (error) {
		console.error("Setting error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const deleteAccount = async (req, reply) => {
	try {
		const changes = await deleteUser(req.user.id);
		return reply.code(200).send({changes: changes, success: true});
	} catch (error) {
		console.error("Setting error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const security = async (req, reply) => {
	try {
		const {currentPassword, newPassword, confirmPassword} = req.body;
		const user = await getUserById(req.user.id);

		if (user.google_id) {
			return reply.code(400).send({ error: 'Cannot change password for Google account', code: 3 });
		}
		console.log('user $$$$$$=> ', user);

		const isMatch = await comparePassword(currentPassword, user.password); // you forgot await

		if (!isMatch) {
			return reply.code(400).send({ error: 'Current password is wrong', code: 1 });
		}

		if (newPassword != confirmPassword) {
			return reply.code(400).send({error: 'Passwords do not match', code: 2 });
		}
		const hashed = await hashPassword(newPassword); // you forgot await
		const changes = await updatePassword(req.user.id, hashed);
		return reply.code(201).send({changes, success: true});
	} catch (error) {
		console.error("Setting error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const privacy = async (req, reply) => {
	try {
		const {language} = req.body;
		if (!language)
			return reply.code(400).send({error: 'Missed language'});

		const changes = await updateUserGeneralInfo(req.user.id, language);
		return reply.code(201).send({changes, success: true});
	} catch (error) {
		console.error("Setting error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const putImage = async (req, reply, updateFunction) => {
	try {
		// console.log("user => ", req.user);

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		const data = await req.file();

		if (!allowedTypes.includes(data.mimetype)) {
		return reply.code(400).send({ error: 'Invalid file type' });
		}

		const ext = path.extname(data.filename).toLowerCase();
		if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
		return reply.code(400).send({ error: 'Invalid file extension' });
		}

		const filename = `${Date.now()}-${data.filename}`;
		const filepath = path.join(__dirname, '../uploads', filename);
		console.log(`filepath ::::::: ${filepath}`);

		const buffer = await data.toBuffer();
		await fs.promises.writeFile(filepath, buffer);

		const image_path = `/uploads/${filename}`;
		await updateFunction(req.user.id, image_path);

		return reply.code(201).send({ path: image_path });
	} catch (error) {
		console.error("Setting error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
};


const putIMG = async (req, reply) => {
	return putImage(req, reply, updateImage);
};

const putCover = async (req, reply) => {
	return putImage(req, reply, updateCover);
};

const deleteIMG = async (req, reply) => {
	try {
		const user = await getProfile(req.user.id);
		const filepath = path.join(__dirname, '../uploads', user.profile_image);
		if (fs.existsSync(filepath)) {
			await fs.promises.unlink(filepath);
			await deleteImage(req.user.id);
			return reply.send({ success: true, message: 'File removed' });
		} else {
			return reply.code(404).send({ error: 'File not found' });
		}
	} catch (error) {
		console.error("Setting error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const twofa = async (request, reply) => {
	const { enabled } = request.body;

	console.log("Request ", request.user);
	console.log("Type of enabled = ", typeof enabled);
	if (typeof enabled !== 'boolean') {
		return reply.code(400).send({error: "Missed enabled field."});
	}
	try {
		// console.log('request.id => ', request.user.id);
		const changes = await update2fa(request.user.id, enabled);
		console.log("changes => ", changes);
		if (changes === 0) {
			return reply.code(404).send({ error: "Cloud not enabled/disable 2fa." });
		}
		return reply.send({
			message: `2FA has been ${enabled ? 'enabled' : 'disabled'} successfully.`
		});
	} catch (error) {
		console.error("2fa Error:", error);
		return reply.code(500).send({ error: "Internal server error" });
	}
}

const search = async (request, reply) => {
	let to_find = request.query.to_find;


	if (!to_find || to_find.trim().length === 0) {
		return reply.code(400).send({error: 'Missing username or name to search'});
	}

	to_find = to_find?.trim();

	try {
		const user_id = request.user.id;
		let result = await searchForUser(user_id, to_find);
		if (!result || result.length === 0)
			return reply.code(404).send({message: 'No users found matching your search'});

		const finalResult = await Promise.all(
			result.map(async user => ({
				...user,
				frindship_status: await getFriendshipStatus(user_id, user.id),
			}))
		);

		return reply.code(200).send({result: finalResult});
	} catch (error) {
		console.error("search Error:", error);
		return reply.code(500).send({ error: "Internal server error" });
	}
}


module.exports = {
	profile,
	account,
	security,
	privacy,
	putIMG,
	putCover,
	deleteIMG,
	deleteAccount,
	twofa,
	search,
};
