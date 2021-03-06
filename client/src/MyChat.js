import React, {useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ScrollToBottom from "react-scroll-to-bottom";
import MyUserList from "./MyUserList";

//Responsible for the chat functionality
function MyChat({socket, nickName, color}) {
    const [message, setMessage] = React.useState("")
    const [chatMessages, setChatMessages] = React.useState([])
    const [showUserList, setShowUserList] = React.useState(false)

    function sendMessage() {
        setMessage("")
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

    function handleChatMessages() {
        socket.on("updateChat", (data) => {
            setChatMessages(data)
        })
    }

    useEffect(() => {
        handleChatMessages();
    }, [socket])

    //Ensures that the message is always visible regardless of the color a user picks
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
                            <div className="chatHeader">
                                <p>Chat Chat</p>
                            </div>
                            <div className="chatBody">
                                <ScrollToBottom className="messageContainer">
                                    {
                                        chatMessages.map((messageContent) => {
                                            return (
                                                <div
                                                    className="message"
                                                    id={socket.id === messageContent.socket ? "you" : "other"}
                                                >
                                                    <div>
                                                        <div className="messageContent"
                                                             style={{backgroundColor: messageContent.color}}>
                                                            <p style={{color: invertColor(messageContent.color)}}>{messageContent.message}</p>
                                                        </div>
                                                        <div className="messageMeta">
                                                            {
                                                                socket.id === messageContent.socket ?
                                                                    <>
                                                                        <p id="time">{messageContent.time}</p>
                                                                        <p id="author">{messageContent.nickName}</p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <p id="time">{messageContent.nickName}</p>
                                                                        <p id="author">{messageContent.time}</p>
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </ScrollToBottom>
                            </div>
                            <div className="chatFooter">
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
        </>
    )
}

export default MyChat;