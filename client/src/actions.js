// this will contain all of our action creators
// actionscreator = function that resturns obj

import axios from "./axios";
// following action descriptions
export const GET_FRIENDS_LIST = "GET_FRIENDS_LIST";
export const BEFRIEND = "BEFRIEND";
export const UNFRIEND = "UNFRIEND";

export async function getFriendsList() {
    // we can OPTIONALLY talk to the server here ...
    const { data } = await axios.get("/friendslist");
    console.log("data in actions:", data);
    return {
        type: GET_FRIENDS_LIST,
        data: data,
    };
}

export async function acceptFriend(id) {
    const { data } = await axios.post("/friendslist");
    return {
        type: BEFRIEND,
        data: data,
    };
}

export async function unfriend(id) {
    const { data } = await axios.post("/friendslist");
    return {
        type: UNFRIEND,
        data: data,
    };
}
