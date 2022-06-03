import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
        required: true,
    },
});

export const User = mongoose.model('User', userSchema);
