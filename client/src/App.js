import React from "react";
import './App.css';
import io from 'socket.io-client';
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001")

function App() {
    const [nickName, setNickName] = React.useState("");
    const [inChatRoom, setInChatRoom] = React.useState(false)

    React.useEffect(() => {

    }, []);

    async function joinChat() {
        socket.emit("join", nickName)
        setInChatRoom(true)
    }

    return (
        <div className="App">
            <header className="App-header">
                <h3>Chat Chat - For Chatty People</h3>
                {!inChatRoom ?
                    (
                        <div><p>{nickName}</p>
                            < input type="text" placeholder="Enter a nickname!"
                                    onChange={(event) => setNickName(event.target.value)}/>
                            <button onClick={() => joinChat()}>Start Chatting!</button>
                        </div>
                    )
                    :
                    (
                        <Chat socket={socket} nickName={nickName}/>
                    )
                }
            </header>
        </div>
    );
}

export default App;
