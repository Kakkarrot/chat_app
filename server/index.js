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

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join", (data) => {
        console.log("User", data,"has joined");
        // socket.join(ROOM);
    })

    socket.on("messageChat", (data) => {
        console.log("User", data.nickName, "sent:", data.message);
        socket.broadcast.emit("updateChat", data)
        socket.emit("updateChat", data)
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(PORT, () => {
    console.log("Server listening on ", PORT);
});