import React, {useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ScrollToBottom from "react-scroll-to-bottom";
import MyUserList from "./MyUserList";


function MyChat({socket, nickName, color}) {
    const [message, setMessage] = React.useState("")
    const [chatMessages, setChatMessages] = React.useState([])
    const [showUserList, setShowUserList] = React.useState(false)

    async function sendMessage() {
        if (message.length !== 0) {
            const messageJson = {
                "nickName": nickName,
                "message": message,
                "socket": socket.id,
                "color": color,
            }
            socket.emit("messageChat", messageJson);
        }
    }

    useEffect(() => {
        socket.on("updateChat", (data) => {
            console.log(data)
            setChatMessages(data)
        })
    }, [socket])

    function invertColor(hex) {
        return "#" + (Number(`0x1${hex.substring(1)}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
    }

    return (
        <>

            <div className="chatWindow">
                <button className="toggleView"
                    onClick={() => setShowUserList(!showUserList)}>{showUserList ? "Show Chat" : "Show Users"}</button>
                {showUserList
                    ?
                    (
                        <>
                            <MyUserList socket={socket}/>
                        </>
                    )
                    :
                    (
                        <>
                            <div className="chat-header">
                                <p>Chat Chat</p>
                            </div>
                            <div className="chat-body">
                                <ScrollToBottom className="message-container">
                                    {
                                        chatMessages.map((messageContent) => {
                                            return (
                                                <div
                                                    className="message"
                                                    id={socket.id === messageContent.socket ? "you" : "other"}
                                                >
                                                    <div>
                                                        <div className="message-content"
                                                             style={{backgroundColor: messageContent.color}}>
                                                            <p style={{color: invertColor(messageContent.color)}}>{messageContent.message}</p>
                                                        </div>
                                                        <div className="message-meta">
                                                            <p id="time">{messageContent.time}</p>
                                                            <p id="author">{messageContent.nickName}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </ScrollToBottom>
                            </div>
                            <div className="chat-footer">
                                <input
                                    type="text"
                                    value={message}
                                    placeholder="Hey..."
                                    onChange={(event) => {
                                        setMessage(event.target.value);
                                    }}
                                    onKeyPress={(event) => {
                                        event.key === "Enter" && sendMessage();
                                    }}
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </>
                    )
                }


            </div>


            {/*<button onClick={() => setShowUserList(!showUserList)}>{showUserList ? "Show Chat" : "Show Users"}</button>*/}

        </>
    )
}

export default MyChat;