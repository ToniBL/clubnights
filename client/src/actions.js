// this will contain all of our action creators
// actionscreator = function that resturns obj

import axios from "./axios";
// following action descriptions
export const GET_FRIENDS_LIST = "GET_FRIENDS_LIST";
export const ACCEPT = "ACCEPT";
export const CANCEL = "CANCEL";

export async function getFriendsList() {
    // we can OPTIONALLY talk to the server here ...
    const { data } = await axios.get("/api/friendslist");
    console.log("data in actions:", data);
    return {
        type: GET_FRIENDS_LIST,
        data: data,
    };
}

export async function acceptFriend(otherUserId) {
    const { data } = await axios.post(`/friendstatus/${otherUserId}`, {
        action: "accept",
    });
    return {
        type: ACCEPT,
        data: otherUserId,
    };
}

export async function cancelFriend(otherUserId) {
    let cancel = true;
    console.log("otherUserId", otherUserId);
    const { data } = await axios.post(`/friendstatus/${otherUserId}`, {
        cancel,
    });
    return {
        type: CANCEL,
        data: otherUserId,
    };
}
