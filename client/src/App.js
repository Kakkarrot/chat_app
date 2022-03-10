import React from "react";
import './App.css';
import io from 'socket.io-client';
import Chat from "./Chat";
import {HexColorPicker} from "react-colorful";
// import "react-colorful/dist/index.css";

const socket = io.connect("http://localhost:3001")

function App() {
    const [nickName, setNickName] = React.useState("");
    const [color, setColor] = React.useState("#4a00ff");
    const [inChatRoom, setInChatRoom] = React.useState(false)
    const [duplicateNickName, setDuplicateNickName] = React.useState(false)

    async function joinChat() {
        socket.emit("join", {nickName, color})
        await socket.on("uniqueNickName", (data) => {
            if (data) {
                setDuplicateNickName(false)
                setInChatRoom(true)
            } else {
                setDuplicateNickName(true)
            }
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                {!inChatRoom ?
                    (
                        <div className="joinChatContainer">
                            <h3>Chat Chat</h3>
                            <h4>For Chatty People</h4>
                            <p>Enter Your Nickname!</p>
                            < input type="text" placeholder="Enter a nickname"
                                    onChange={(event) => setNickName(event.target.value)}/>
                            <p>Choose your Color!</p>
                            <HexColorPicker className="colorPicker" color={color} onChange={(event) => {
                                setColor(event)
                            }}/>
                            <p>Or Just Enter!</p>
                            <button onClick={() => joinChat()}>Start Chatting!</button>
                            {duplicateNickName ? <p className="duplicateNickName">Username already Exists!</p> : <></>}
                        </div>
                    )
                    :
                    (
                        <Chat socket={socket} nickName={nickName} color={color}/>
                    )
                }
            </header>
        </div>
    );
}

export default App;
