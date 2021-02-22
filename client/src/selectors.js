export const getFriendsAndPending = (state) => state.friendships;

export const getFriends = (state) =>
    state.friendships.filter((people) => people.accepted === true);

export const getPending = (state) =>
    state.friendships.filter((people) => people.accepted === false);
