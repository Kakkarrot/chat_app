import React, {useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Row, Col} from "react-bootstrap";

function Chat({socket, nickName, color}) {
    const [message, setMessage] = React.useState("")
    const [chatMessages, setChatMessages] = React.useState([])

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

    return (
        <>
            <div>
                <h3>Chat Chat</h3>
            </div>
            <Row>
                <Col>
                    <div>
                        {
                            chatMessages.map((message) => {
                                return <>
                                    <p>{message.message}</p>
                                    <p>{message.time}</p>
                                </>
                            })
                        }
                    </div>
                    <div>
                        <input type="text" placeholder="Start by saying hello!"
                               onChange={(event) => setMessage(event.target.value)}/>
                        <button onClick={() => sendMessage()}>Send</button>
                    </div>
                </Col>
                <Col>
                    test
                </Col>
            </Row>
        </>
    )
}

export default Chat;