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
    },
});

let chatMessages = [];
let connections = {};
let users = new Set();
let guestCounter = 1;

io.on("connection", (socket) => {
    function changeNickName(data) {
        if(users.has(data.message.substring(6))) {
            socket.emit("uniqueNickName", {showChat: false})
        } else {
            data.nickName = data.message.substring(6)
            socket.emit("uniqueNickName", {showChat: true, data})
            connections[socket.id] = data.nickName;
            users.add(data.nickName)
        }
    }

    console.log("User Connected:", socket.id);
    connections[socket.id] = "";

    socket.on("join", (data) => {
        if (data.nickName === "") {
            data.nickName = "Guest_" + guestCounter++;
        }
        console.log("User", data.nickName,"has joined");
        if (users.has(data.nickName)) {
            socket.emit("uniqueNickName", {showChat: false})
        } else {
            socket.emit("uniqueNickName", {showChat: true, data})
            connections[socket.id] = data.nickName;
            users.add(data.nickName)
            socket.emit("updateChat", chatMessages)
        }
    })

    socket.on("messageChat", (data) => {
        console.log("User", data.nickName, "sent:", data);
        if (data.message.startsWith("/nick ")){
            changeNickName(data)
            return;
        }
        data["time"] = new Date().toLocaleTimeString()
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