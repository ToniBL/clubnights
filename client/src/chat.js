//import socket from "./start";

//should display  all of the messages that have been received as well as a <textarea> in which the user can type a new message. When the user hits the enter key in this <textarea> or presses a "send" button, a 'chatMessage' event should be emitted.

import { socket } from "./socket";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import ReactPlayer from "./lounge";

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
            <div className="bar-title">
                <h1>bar</h1>
                <p> grab a beer, chill and chat </p>
            </div>

            <div className="chatbox">
                <textarea
                    className="textfield"
                    cols="20"
                    rows="5"
                    placeholder="your text"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => submitMessage(e)}
                ></textarea>

                <div className="chatstream" ref={elemRef}>
                    {msgs &&
                        msgs.map((message, index) => (
                            <div className="message" key={index}>
                                <img
                                    className="logo-nav"
                                    size="small"
                                    src={
                                        message.profile_pic_url ||
                                        "/001-headphones.svg"
                                    }
                                />
                                <p className="messanger">
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
