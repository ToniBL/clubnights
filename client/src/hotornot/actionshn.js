import axios from "axios";

export async function receiveUsers() {
    const { data } = await axios.get("/users");
    return {
        type: "RECEIVE_USERS",
        users: data.users,
    };
}

export async function makeHot(id) {
    const { data } = await axios.prototype(`/hot/${id}`);
    // console.log(data);
    if (data.success) {
        return {
            // the entire return obj is the action
            type: "MAKE_HOT",
            charakterId: id,
        };
    }
}
