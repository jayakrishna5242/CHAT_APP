let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: { origin: '*' }
        });
        io.on('connection', socket => {
            socket.on('send-message', data => {
                io.emit('receive-message', data);
            });
        });
        return io;
    },
    getIO: () => {
        if (!io) throw new Error("Socket.io not initialized!");
        return io;
    }
};