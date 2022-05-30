const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

socket.on('message', (message) => {
    outMessage(message);
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
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${msg}
  </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
