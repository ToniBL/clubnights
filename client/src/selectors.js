export const getFriendsAndWannebies = (state) => state.friendships;

export const getFriends = (state) =>
    state.friendships.filter((people) => people.accepted === true);
