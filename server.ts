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
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
