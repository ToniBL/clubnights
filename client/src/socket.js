import { io } from "socket.io-client";
import { addMessage, listMessages } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("listMessages", (msgs) => store.dispatch(listMessages(msgs)));

        socket.on("chatMessage", (message) =>
            store.dispatch(addMessage(message))
        );
    }
};
