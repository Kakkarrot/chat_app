const express = require("express");

const PORT = 3001;

const app = express();

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

const io = new Server(server, {
    cors: {
        //From end URL that will be using the server
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const ROOM = "42069"

let chatMessages = [];
let connections = {};
let users = new Set();

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    connections[socket.id] = "";

    socket.on("join", (data) => {
        console.log("User", data,"has joined");
        if (users.has(data)) {
            socket.emit("uniqueNickName", false)
        } else {
            socket.emit("uniqueNickName", true)
            connections[socket.id] = data;
            users.add(data)
            socket.emit("updateChat", chatMessages)
        }
    })

    socket.on("messageChat", (data) => {
        console.log("User", data.nickName, "sent:", data.message);
        chatMessages.push(data)
        if (chatMessages.length > 10) {
            chatMessages.shift()
        }
        socket.broadcast.emit("updateChat", chatMessages)
        socket.emit("updateChat", chatMessages)
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        let nickName = connections[socket.id]
        delete connections[socket.id];
        users.delete(nickName)
    });
});

server.listen(PORT, () => {
    console.log("Server listening on ", PORT);
});