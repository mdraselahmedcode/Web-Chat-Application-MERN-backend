// import express from 'express';
// import { Server } from 'socket.io';
// import http from 'http';


// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: ['http://localhost:3000',],
//         methods: ['GET', 'POST'],
//     },
// });

// const userSocketMap = {}; // {userId->socketId}

// io.on('connection', (socket) => {
//     const userId = socket.handshake.query.userId;
//     if (userId !== undefined) {
//         userSocketMap[userId] = socket.id;
//     }

//     io.emit('getOnlineUsers', Object.keys(userSocketMap));


//     socket.on('disconnect', ()=>{
//         delete userSocketMap[userId];
//         io.emit('getonlineUsers', Object.keys(userSocketMap));
//     } )


// })


// export { app, io, server };








import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];  // proving corresponding socket id after getting the receiver id from the message controller send message

}

const userSocketMap = {}; // {userId -> socketId}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };
