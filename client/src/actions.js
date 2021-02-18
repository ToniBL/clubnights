// this will contain all of our action creators
// actionscreator = function that resturns obj

import axios from "axios";

// import axios from "./axios"

export async function myfirstactioncreator() {
    // we can OPTIONALLY talk to the server here ...
    const { data = await axios.get("/someroute") };
    return {
        type: "UPDATE_STATE_SOMEHOW",
        data: data.user.id,
    };
}
