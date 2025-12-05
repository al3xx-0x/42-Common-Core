const { addFirend, respondFriend, getFriends, getRequests, removeFirend, getFriendshipStatus } = require('../models/friendsModel');
const { getUserById } = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');

const add = async (req, reply) => {
	try {
		const {friend_id} = req.body;
		const user_id = req.user.id;

		if (!friend_id)
			return reply.code(400).send({ error: "Missed friend_id field." });

		const friendStatus = await getFriendshipStatus(user_id, friend_id);
		if (friendStatus === 'accepted')
			return reply.code(400).send({ error: "The user is already friend." });
		if (friendStatus === 'pending')
			return reply.code(400).send({ error: "The friend request is already sent." });
		
		const {id} = await addFirend(user_id, friend_id);
		const sender = await getUserById(user_id);
		
		try {
			const notification = await NotificationModel.createNotification(
				"friend",
				`${sender.username} sent you a friend request`,
				user_id,
				friend_id,
				id 
			);
			if (req.server.io && notification) {
				const notificationData = {
					id: notification.id,
					type: notification.type,
					content: notification.content,
					sender_id: notification.sender_id,
					receiver_id: notification.receiver_id,
					timestamp: notification.created_at,
					read: notification.is_read === 1,
					sender_username: notification.sender_username,
					sender_profile_image: notification.sender_profile_image
				};
				
				req.server.io.to(`user_${friend_id}`).emit("notification", notificationData);
				console.log(`Friend request notification saved and sent to user ${friend_id} from ${sender.username}`);
			}
		} catch (notificationError) {
			console.error('Error creating friend request notification:', notificationError);
		}

		return reply.code(200).send({success: true, request_id: id, message: 'Friend request sent'})
	} catch (error) {
		console.error("Friend error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const removeFriendRequest = async (req, reply) => {
	try {
		const {friend_id} = req.body;
		const user_id = req.user.id;

		if (!friend_id)
			return reply.code(400).send({ error: "Missed friend_id field." });

		await removeFirend(user_id, friend_id);
		return reply.code(200).send({success: true, message: 'Friend request removed'})
	} catch (error) {
		console.error("Friend error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const respond = async (req, reply) => {
	try {
		const {friend_id, action} = req.body;
		if (!friend_id)
			return reply.code(400).send({ error: "Missed friend_id field." });
		console.log(`${req.user.id} => ${friend_id} | ${action}`);
		const {message} = await respondFriend(req.user.id, friend_id, action);
		return reply.code(200).send({success: true, message});
	} catch (error) {
		console.error("Friend error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const friends = async (req, reply) => {
	try {
		const friends = await getFriends(req.user.id);
		console.log('friends => ', friends);

		return reply.code(200).send({friends: friends});
	} catch (error) {
		console.error("Friend error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}

const requests = async (req, reply) => {
	try {
		const friendRequests = await getRequests(req.user.id);
		console.log('friendRequests => ', friendRequests);
		return reply.send({requests: friendRequests})
	} catch (error) {
		console.error("Friend error:", error.message);
		return reply.code(500).send({ error: "Internal server error." });
	}
}


module.exports = {add, respond, friends, requests, removeFriendRequest};
