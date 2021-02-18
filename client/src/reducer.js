// holds a series of ifstatements to check actions and in the create state wgich is an obj

// the very first time state is gonna be empty, therefore we set empty obj as default value. will be filled.

export function reducer(state = {}, action) {
    if (action.type === "UPDATE_STATE_SOMEHOW") {
        //update the state
    }

    return state;
}
