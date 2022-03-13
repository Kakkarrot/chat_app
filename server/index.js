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
    function changeNickname(data) {
        if(users.has(data.message.substring(6))) {
            socket.emit("changeNickname", {validNickname: false})
            return;
        } else {
            users.delete(data.nickName)
            data.nickName = data.message.substring(6)
            socket.emit("changeNickname", {validNickname: true, data})
            connections[socket.id] = {nickName: data.nickName, color: data.color};
            users.add(data.nickName)
        }
        socket.broadcast.emit("updateUsers", connections)
        socket.emit("updateUsers", connections)
    }

    function changeColor(data) {
        let validColor = /^#[0-9A-F]{6}$/i;
        if (validColor.test(data.message.substring(11))) {
            data.color = data.message.substring(11)
            socket.emit("changeColor", {validColor: true, data})
        } else {
            socket.emit("changeColor", {validColor: false})
            return;
        }
        socket.broadcast.emit("updateUsers", connections)
        socket.emit("updateUsers", connections)
    }

    socket.on("getUsers", () => {
        socket.emit("updateUsers", connections)
    })

    socket.on("join", (data) => {
        if (data.nickName === "") {
            data.nickName = "Guest_" + guestCounter++;
        }
        if (users.has(data.nickName)) {
            socket.emit("uniqueNickname", {showChat: false})
            return;
        } else {
            socket.emit("uniqueNickname", {showChat: true, data})
            connections[socket.id] = {nickName: data.nickName, color: data.color};
            users.add(data.nickName)
            socket.emit("updateChat", chatMessages)
        }
        socket.broadcast.emit("updateUsers", connections)
        socket.emit("updateUsers", connections)
    })

    socket.on("messageChat", (data) => {
        if (data.message.toLowerCase().startsWith("/nick ")){
            changeNickname(data)
            return;
        }
        if (data.message.toLowerCase().startsWith("/nickcolor ")) {
            changeColor(data)
            return;
        }
        data["time"] = new Date().toLocaleTimeString()
        data["time"] = new Date().toLocaleTimeString()
        chatMessages.push(data)
        if (chatMessages.length > 200) {
            chatMessages.shift()
        }
        socket.broadcast.emit("updateChat", chatMessages)
        socket.emit("updateChat", chatMessages)
    })

    socket.on("disconnect", () => {
        if (!connections[socket.id]){
            return;
        }
        let nickName = connections[socket.id].nickName
        delete connections[socket.id];
        users.delete(nickName)
        socket.broadcast.emit("updateUsers", connections)
        socket.emit("updateUsers", connections)
    });
});

server.listen(PORT, () => {
    console.log("Server listening on ", PORT);
});