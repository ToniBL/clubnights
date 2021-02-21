// holds a series of ifstatements to check actions and in the create state wgich is an obj

// the very first time state is gonna be empty, therefore we set empty obj as default value. will be filled.
import { GET_FRIENDS_LIST, BEFRIEND, UNFRIEND } from "./actions";

const initialState = { friendships: [] };

export function reducer(state = initialState, action) {
    if (action.type === GET_FRIENDS_LIST) {
        state = {
            ...state,
            friendships: [...state.friendships, ...action.data],
        };
    }

    return state;
}
