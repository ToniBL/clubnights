// holds a series of ifstatements to check actions and in the create state wgich is an obj

// the very first time state is gonna be empty, therefore we set empty obj as default value. will be filled.
import {
    GET_FRIENDS_LIST,
    ACCEPT,
    CANCEL,
    LIST_MESSAGES,
    ADD_MESSAGE,
} from "./actions";

const initialState = { friendships: [], messages: [] };

export function reducer(state = initialState, action) {
    if (action.type === GET_FRIENDS_LIST) {
        state = {
            ...state,
            friendships: [...state.friendships, ...action.data],
        };
    }

    if (action.type === CANCEL) {
        state = {
            ...state,
            friendships: state.friendships.filter(
                (user) => user.id != action.data
            ),
        };
    }

    if (action.type === ACCEPT) {
        console.log("state in ACCEPT:", state);
        console.log("action.data ACCEPT:", action.data);
        state = {
            ...state,
            friendships: state.friendships.map((user) => {
                if (user.id === action.data) {
                    return { ...user, accepted: true };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type === LIST_MESSAGES) {
        console.log("state in DISPLAY:", state);
        console.log("action.data in DISPLAY", action.message);
        state = {
            ...state,
            messages: [...state.messages, ...action.message],
        };
    }

    if (action.type === ADD_MESSAGE) {
        state = {
            ...state,
            messages: [...state.messages, ...action.message],
        };
    }

    return state;
}
