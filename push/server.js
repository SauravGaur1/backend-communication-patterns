const http = require('http');
const { Server } = require("socket.io"); 
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'index.html');
    fs.createReadStream(filePath).pipe(res);
});

const io = new Server(server);

io.on('connection', (socket) => {
    io.emit("message", `A new User ${socket.id} has Joined`);
    socket.on("message", (msg) => {
        socket.broadcast.emit("message", msg);
    });
})

server.listen(3000, () => {
    console.log("Started");
})