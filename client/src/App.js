import React from "react";
import './App.css';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001")

function App() {
  const [nickName, setNickName] = React.useState("");

  React.useEffect(() => {

  }, []);

  function joinChat() {
      socket.emit("join", nickName)
  }

  return (
    <div className="App">
      <header className="App-header">
          <h3>Chat Chat - For Chatty People</h3>
          <p>{nickName}</p>
          <input type="text" placeholder="Enter a nickname!"
                 onChange={(event) => setNickName(event.target.value)}/>
          <button onClick={() => joinChat()}>Start Chatting!</button>
      </header>
    </div>
  );
}

export default App;
