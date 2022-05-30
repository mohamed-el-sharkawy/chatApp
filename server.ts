import path from 'path';
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('New WS connection');

    socket.emit('message', 'Welcome to the ChatApp');

    socket.broadcast.emit('message', 'New user joined');

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
