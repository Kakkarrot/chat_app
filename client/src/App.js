import React, {useEffect, useMemo} from "react";
import './App.css';
import io from 'socket.io-client';
import MyChat from "./MyChat";
import {HexColorPicker} from "react-colorful";
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io.connect("http://localhost:3001")

function App() {
    const [nickName, setNickName] = React.useState("");
    const [color, setColor] = React.useState("#4a00ff");
    const [inChatRoom, setInChatRoom] = React.useState(false)
    const [duplicateNickName, setDuplicateNickName] = React.useState(false)
    const [invalidColor, setInvalidColor] = React.useState(false)

    async function joinChat() {
        socket.emit("join", {nickName, color})
    }

    useEffect(() => {
        socket.on("uniqueNickname", (data) => {
            if (data.showChat) {
                setDuplicateNickName(false)
                setInChatRoom(true)
                setNickName(data.data.nickName)
            } else {
                setDuplicateNickName(true)
            }
        });
        socket.on("changeNickname", (data) => {
            if (data.validNickname) {
                setDuplicateNickName(false)
                setNickName(data.data.nickName)
            } else {
                setDuplicateNickName(true)
            }
        })
        socket.on("changeColor", (data) => {
            console.log(data)
            if(data.validColor) {
                setInvalidColor(false)
                setColor(data.data.color)
            } else {
                setInvalidColor(true)
            }
        })
        socket.on("updateChat", (data) => {
            if (data[data.length - 1].socket === socket.id){
                setDuplicateNickName(false)
                setInvalidColor(false)
            }
        })
    }, [socket])

    return (
        <div className="App">
            <header className="App-header">
                {!inChatRoom ?
                    (
                        <div className="joinChatContainer">
                            <h3>Chat Chat</h3>
                            <h4>For Chatty People</h4>
                            <p>Enter Your Nickname!</p>
                            <input type="text" placeholder="Enter a nickname"
                                   onChange={(event) => setNickName(event.target.value)}/>
                            <p>Choose your Color!</p>
                            <HexColorPicker className="colorPicker" color={color} onChange={(event) => {
                                setColor(event)
                            }}/>
                            <p>Or Just Enter!</p>
                            <button onClick={() => joinChat()}>Start Chatting!</button>
                        </div>
                    )
                    :
                    (
                        <MyChat socket={socket} nickName={nickName} color={color}/>
                    )
                }
                {duplicateNickName ? <p className="duplicateNickName">Nickname already exists!</p> : <></>}
                {invalidColor ? <p className="invalidColor">Color not valid! Try #RRGGBB format!</p> : <></>}
            </header>
        </div>
    );
}

export default App;
