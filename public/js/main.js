const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', (message) => {
    outMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('chatMessage', (message) => {
    console.log(message);

    outMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    const roomName = document.getElementById('room-name');
    roomName.innerText = room;
}

function outputUsers(users) {
    const usersList = document.getElementById('users');

    usersList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
}
