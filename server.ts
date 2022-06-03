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
    socket.on('joinRoom', async ({ username, room }) => {
        const user = new User({ socketId: socket.id, username, room });
        await user.save();

        socket.join(room);

        socket.emit(
            'message',
            formatMessages('ChatApp', `Welcome to ${room} room`)
        );

        socket.broadcast
            .to(room)
            .emit(
                'message',
                formatMessages(
                    'ChatApp',
                    `${username} has joinded the room ${room}`
                )
            );

        io.to(room).emit('roomUsers', {
            room,
            users: await User.find({ room }),
        });
    });

    socket.on('chatMessage', async (msg) => {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
            io.to(user.room).emit(
                'chatMessage',
                formatMessages(`${user.username}`, msg)
            );
        }
    });

    socket.on('disconnect', async () => {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessages('ChatApp', `${user.username} has left the chat`)
            );
            user.delete();

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: await User.find({ room: user.room }),
            });
        }
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
