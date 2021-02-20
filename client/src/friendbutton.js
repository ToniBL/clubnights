import { useState, useEffect } from "react";
import axios from "./axios";

export default function Friendbutton(props) {
    const [buttonText, setButtonText] = useState("");
    const [action, setAction] = useState("");
    let otherUserId = props.otherUserId;
    let loggedInUserId = props.loggedInUser;
    console.log("otherUserId:", otherUserId);
    // console.log("loggedInUserId:", loggedInUserId);
    useEffect(async () => {
        //let abort = false;
        try {
            // if (!abort) {
            const { data } = await axios.get(`/friendstatus/${otherUserId}`);
            console.log("data:", data);
            setButtonText(data.buttonText);
            setAction(data.action);
            //  }
        } catch (err) {
            console.log("err in friendbutton:", err);
        }
        //cleanup-function, runs before every re-render
        return () => {
            console.log("buttonText in returned function:", buttonText);
            //   abort = true;
        };
    }, []);

    const changeFriendStatus = async () => {
        console.log("sent axios post");
        const { data } = await axios.post(`/friendstatus/${otherUserId}`, {
            action,
        });
        console.log("data:", data);
        setButtonText(data.buttonText);
        setAction(data.action);
    };

    return (
        <div>
            <button
                className="FriendButton"
                onClick={() => changeFriendStatus()}
            >
                {buttonText}
            </button>
        </div>
    );
}
