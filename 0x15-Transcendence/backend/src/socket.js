const fp = require("fastify-plugin");
const { Server } = require("socket.io");
const { Player } = require("./game/entities/player");

module.exports = fp(async function (fastify) { 
    const socket_io = new Server(fastify.server, {
        cors: {
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });

    
    socket_io.on("connection", onConnection);
    fastify.decorate("io", socket_io);

    function onConnection(socket) {
        const userId = socket.user && socket.user.id ? String(socket.user.id) : null;
        console.log(userId, ": CONNECTED TO SERVER");

        socket.on("disconnect", () => {
            console.log(userId, ": DISCONNECTED FROM SERVER");
        });
    }
});