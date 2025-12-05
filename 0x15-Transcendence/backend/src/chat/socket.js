const fp = require("fastify-plugin");
const { verifyAccess } = require('../utils/jwt');
const {savedMessages, getMessages, markMessageRead, unreadMessagesCounter, getAllUsers, getLastMessage} = require('./savedMessages');
const {blockUser, unblockUser, isUserBlocked, getBlockedUsers, areUsersBlocked} = require('../models/blockModel');
const { getUserById } = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');

module.exports = fp(async function (fastify) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>connected to chat serveeeeeeeeer");
    
    if (!fastify.io) {
        throw new Error('Socket.IO instance not found. Make sure chat socket is registered first.');
    }
    const onlineUsers = {};
    
    const io = fastify.io;

    fastify.get("/api/messages", async (req, reply) => {
        const { sender, receiver } = req.query;
        if (!sender || !receiver) {
            return reply.status(400).send({ error: "Sender and receiver are required" });
        }
        try {
            const messages = await getMessages(sender, receiver, 50);
            return reply.send(messages);
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to fetch messages" });
        }
    });

    fastify.get("/api/messages/read", async(req, reply) => {
        const { sender, receiver } = req.query;
        if (!sender || !receiver) {
            return reply.status(400).send({ error: "Sender and receiver are required" });
        }
        try {
            const read = await markMessageRead(sender, receiver)
            return reply.send({success: true, updated: read});
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to mark messages as read" });
        }
    })

    fastify.get("/api/messages/unread", async(req, reply) => {
        const {receiver} = req.query;
        if (!receiver) {
            return reply.status(400).send({ error: "receiver are required" });
        }
        try {
            const counter = await unreadMessagesCounter(receiver)
            return reply.send(counter);
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to mark messages as read" });
        }
    })

    fastify.get("/api/users", async(req, reply) => {
        const { id } = req.query;
        if (!id)
            return reply.status(400).send({ error: "Current user ID is required" });
        try {
            const users = await getAllUsers(parseInt(id))
            return reply.send(users)
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to get users" });
        }
    })

    fastify.get("/api/messages/last", async(req, reply) => {
        const { sender, receiver } = req.query;
        if (!sender || !receiver) {
            return reply.status(400).send({ error: "Sender and receiver are required" });
        }
        try {
            const lastMessage = await getLastMessage(sender, receiver)
            return reply.send(lastMessage);
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to get last message" });
        }
    })

    fastify.post("/api/block", { preHandler: fastify.auth }, async (req, reply) => {
        try {
            const { blockedId } = req.body;
            const blockerId = req.user.id;

            if (!blockedId) {
                return reply.status(400).send({ error: "blockedId is required" });
            }

            if (blockerId === blockedId) {
                return reply.status(400).send({ error: "Cannot block yourself" });
            }

            await blockUser(blockerId, blockedId);
            return reply.send({ success: true, message: "User blocked successfully" });
        } catch (err) {
            console.error("Block user error:", err);
            if (err.message === "User is already blocked") {
                return reply.status(409).send({ error: err.message });
            }
            return reply.status(500).send({ error: "Failed to block user" });
        }
    });

    fastify.delete("/api/block/:blocked_id", { preHandler: fastify.auth }, async (req, reply) => {
        try {
            const blockedId = parseInt(req.params.blocked_id);
            const blockerId = req.user.id;

            if (!blockedId || isNaN(blockedId)) {
                return reply.status(400).send({ error: "Valid blocked_id is required" });
            }

            const success = await unblockUser(blockerId, blockedId);
            if (success) {
                return reply.send({ success: true, message: "User unblocked successfully" });
            } else {
                return reply.status(404).send({ error: "Block relationship not found" });
            }
        } catch (err) {
            console.error("Unblock user error:", err);
            return reply.status(500).send({ error: "Failed to unblock user" });
        }
    });

    fastify.get("/api/block/check/:user_id", { preHandler: fastify.auth }, async (req, reply) => {
        try {
            const userId = parseInt(req.params.user_id);
            const currentUserId = req.user.id;

            if (!userId || isNaN(userId)) {
                return reply.status(400).send({ error: "Valid user_id is required" });
            }
            const iBlockedThem = await isUserBlocked(currentUserId, userId);
            const theyBlockedMe = await isUserBlocked(userId, currentUserId);
            const isBlocked = iBlockedThem || theyBlockedMe;

            return reply.send({ 
                isBlocked,
                iBlockedThem,
                theyBlockedMe,
                blockDirection: iBlockedThem ? 'i_blocked_them' : theyBlockedMe ? 'they_blocked_me' : 'none'
            });
        } catch (err) {
            console.error("Check block status error:", err);
            return reply.status(500).send({ error: "Failed to check block status" });
        }
    });
    fastify.get("/api/blocked", { preHandler: fastify.auth }, async (req, reply) => {
        try {
            const blockerId = req.user.id;
            const blockedUserIds = await getBlockedUsers(blockerId);
            return reply.send({ blockedUsers: blockedUserIds });
        } catch (err) {
            console.error("Get blocked users error:", err);
            return reply.status(500).send({ error: "Failed to get blocked users" });
        }
    });
    io.use(async (socket, next) => {
        try {
            let token = socket.handshake.auth && socket.handshake.auth.token ? socket.handshake.auth.token : socket.handshake.headers && socket.handshake.headers.authorization;
            if (!token) {
                console.log('Socket connection without token - allowing for debugging');
                socket.user = null;
                return next();
            }
            if (typeof token === 'string' && token.startsWith('Bearer ')) token = token.split(' ')[1];
            const decoded = await verifyAccess(token);
            console.log(">>>>>>>>>>>>>>", decoded);
            socket.user = decoded;
            console.log('Socket authenticated for user:', decoded.id);
            return next();
        } catch (err) {
            console.log('Socket auth failed:', err.message, '- allowing for debugging');
            socket.user = null;
            return next();
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user && socket.user.id ? String(socket.user.id) : null;
        console.log("New client connected:", socket.id, "userId:", userId);

        if (userId) {
            onlineUsers[userId] = socket.id;
            socket.join(`user_${userId}`);
            console.log(`User ${userId} registered with socket ${socket.id} and joined room user_${userId}`);
            console.log("Online users:::", onlineUsers);
            io.emit("onlineUsers", Object.keys(onlineUsers));
        }
        socket.on("register", (userIdFromClient) => {
            const id = socket.user && socket.user.id ? String(socket.user.id) : String(userIdFromClient);
            onlineUsers[id] = socket.id;
            socket.join(`user_${id}`);
            console.log(`User ${id} registered (register event) with socket ${socket.id} and joined room user_${id}`);
            io.emit("onlineUsers", Object.keys(onlineUsers));
        });

        socket.on("privateMessage", async (message) => {
            try {
                const from = socket.user && socket.user.id ? Number(socket.user.id) : Number(message.from);
                const to = Number(message.to);
                const text = message.text;
                console.log("Received message from", from, "to", to, text);
                const isBlocked = await areUsersBlocked(from, to);
                if (isBlocked) {
                    console.log(`Message blocked between users ${from} and ${to}`);
                    socket.emit("messageBlocked", { 
                        message: "Message blocked. You or the recipient has blocked communication.",
                        from: from,
                        to: to
                    });
                    return;
                }

                const saved = await savedMessages(from, to, text);
                try {
                    const senderUser = await getUserById(from);
                    const messagePreview = `${senderUser.username} sent you a message: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`;
                    const notification = await NotificationModel.createNotification(
                        "message",
                        messagePreview,
                        from,
                        to,
                        saved.id 
                    );

                    if (notification) {
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

                        io.to(`user_${to}`).emit("notification", notificationData);
                        console.log(`Message notification saved and sent to user ${to} from ${senderUser.username}`);
                    }
                } catch (notifError) {
                    console.error('Error creating message notification:', notifError);
                }
                
                const receiverSocketId = onlineUsers[String(to)];

                if (receiverSocketId) {
                    console.log(`Sending message to user ${to}`);
                    io.to(receiverSocketId).emit("privateMessage", saved);
                } else {
                    console.log(`User ${to} is not online`);
                }
                socket.emit("privateMessage", saved);
            } catch (err) {
                console.error('privateMessage handler error:', err);
            }
        });

        socket.on("gameInvite", async ({ receiverId }) => {
            try {
                const senderId = socket.user && socket.user.id ? Number(socket.user.id) : null;
                const to = Number(receiverId);

                if (!senderId) {
                    console.error('Game invite rejected: sender not authenticated');
                    socket.emit("gameInviteError", { message: "You must be logged in to send game invites" });
                    return;
                }

                if (senderId === to) {
                    console.error('Game invite rejected: cannot invite yourself');
                    socket.emit("gameInviteError", { message: "You cannot invite yourself to a game" });
                    return;
                }
                const isBlocked = await areUsersBlocked(senderId, to);
                if (isBlocked) {
                    console.log(`Game invite blocked between users ${senderId} and ${to}`);
                    socket.emit("gameInviteError", { 
                        message: "Cannot send game invite. User has been blocked."
                    });
                    return;
                }
                const senderUser = await getUserById(senderId);
                if (!senderUser) {
                    console.error(`Game invite error: sender user ${senderId} not found`);
                    socket.emit("gameInviteError", { message: "Sender user not found" });
                    return;
                }
                const receiverUser = await getUserById(to);
                if (!receiverUser) {
                    console.error(`Game invite error: receiver user ${to} not found`);
                    socket.emit("gameInviteError", { message: "Receiver user not found" });
                    return;
                }
                const inviteMessage = `${senderUser.username} invited you to a head-to-head game!`;
                
                const notification = await NotificationModel.createNotification(
                    "invite",
                    inviteMessage,
                    senderId,
                    to,
                    null
                );

                if (notification) {
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
                    io.to(`user_${to}`).emit("notification", notificationData);
                    io.to(`user_${to}`).emit("gameInviteReceived", {
                        senderId: senderId,
                        senderUsername: senderUser.username,
                        senderProfileImage: senderUser.profile_image,
                        notificationId: notification.id
                    });
                    socket.emit("gameInviteSent", {
                        receiverId: to,
                        receiverUsername: receiverUser.username,
                        message: `Game invite sent to ${receiverUser.username}`
                    });

                    console.log(`Game invite sent from ${senderUser.username} (${senderId}) to ${receiverUser.username} (${to})`);
                } else {
                    throw new Error("Failed to create notification");
                }
            } catch (err) {
                console.error('gameInvite handler error:', err);
                socket.emit("gameInviteError", { 
                    message: "Failed to send game invite. Please try again."
                });
            }
        });

        socket.on("disconnect", () => {
            for (const id in onlineUsers) {
                if (onlineUsers[id] === socket.id) {
                    delete onlineUsers[id];
                    console.log(`User ${id} disconnected`);
                    break;
                }
            }
            console.log("Client disconnected:", socket.id);
            console.log("Online users:", onlineUsers);
            io.emit("onlineUsers", Object.keys(onlineUsers));
        });
    });
});