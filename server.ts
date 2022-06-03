import path from 'path';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import 'dotenv/config';
import { Server } from 'socket.io';
import { formatMessages } from './utils/formatMessages';
import { User } from './models/User';

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        socket.emit(
            'message',
            formatMessages('ChatApp', `Welcome to ${room} room`)
        );

        socket.broadcast.emit(
            'message',
            formatMessages(
                'ChatApp',
                `${username} has joinded the room ${room}`
            )
        );
    });

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', formatMessages('USER', msg));
    });

    socket.on('disconnect', () => {
        io.emit(
            'message',
            formatMessages('ChatApp', 'A user has left the chat')
        );
    });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

start();

async function start() {
    try {
        mongoose.connect(process.env.MONGO_URI!, () => {
            console.log('Connected to MongoDB');
        });
    } catch (error) {
        console.error(error);
    }
    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
