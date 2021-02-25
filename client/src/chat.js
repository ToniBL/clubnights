//import socket from "./start";

//should display  all of the messages that have been received as well as a <textarea> in which the user can type a new message. When the user hits the enter key in this <textarea> or presses a "send" button, a 'chatMessage' event should be emitted.

import { socket } from "./socket";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

export default function Chat() {
    const [message, setMessage] = useState("");

    const msgs = useSelector((state) => {
        console.log("state: ", state);
        return state.messages;
    });

    const elemRef = useRef();

    console.log("MSGS:", msgs);

    useEffect(() => {
        elemRef.current.scrollTop = elemRef.current.clientHeight;
    }, [msgs]);

    const submitMessage = (e) => {
        console.log("MESSAGE in chat:", message);
        if (e.key === "Enter" && elemRef.current.value != 0) {
            e.preventDefault();
            socket.emit("chatMessage", message);
            e.target.value = "";
        }
    };

    return (
        <section className="chat">
            <h1>Chatterbox</h1>
            <div className="chatbox">
                <textarea
                    cols="30"
                    rows="10"
                    placeholder="your text"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => submitMessage(e)}
                ></textarea>
                <button onClick={(e) => submitMessage(e)}>Send</button>
                <div className="chatstream" ref={elemRef}>
                    {msgs &&
                        msgs.map((message, index) => (
                            <div className="message" key={index}>
                                <img
                                    size="small"
                                    src={
                                        message.profile_pic_url ||
                                        "/002-ganesha.svg"
                                    }
                                />
                                <p>
                                    {message.first} {message.last}
                                    {""}
                                </p>
                                <p>{message.message}</p>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}
