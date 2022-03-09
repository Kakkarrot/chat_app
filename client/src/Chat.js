import React, {useEffect} from "react";

function Chat({socket, nickName}) {
    const [message, setMessage] = React.useState("")
    const [chatMessages, setChatMessages] = React.useState([])

    async function sendMessage() {
        if (message.length !== 0) {
            const messageJson = {
                "nickName": nickName,
                "message": message,
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

    return (
        <>
            <div>
                <h3>Chat Chat</h3>
            </div>
            <div>
                {
                    chatMessages.map((message) => {
                        return <p>{message.message}</p>
                    })
                }
            </div>
            <div>
                <input type="text" placeholder="Start by saying hello!"
                       onChange={(event) => setMessage(event.target.value)}/>
                <button onClick={() => sendMessage()}>Send</button>
            </div>
        </>
    )
}

export default Chat;