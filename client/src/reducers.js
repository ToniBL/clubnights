//one big function with several conditionals checking for specific action types 

export default function (state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = {
            ...state,
            users: action.users,
        };
    }
if(action.type === "MAKE_HOT") {
    state = {
        ...state, 
        users: state.users.map((user) => {
            if (user.id === action.characterId) {
                return {
                    ...user, 
                    hot:true,
                } else {
                    return user;
                }
            })
        }
    }
}

    return state;
}
