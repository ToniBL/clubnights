//import ProfilePic from "./profilepic";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getFriendsList } from "./actions";
import { getFriendsAndWannebies, getFriends } from "./selectors";

// import { Link } from "react-router-dom"; -> otional link to profile

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(getFriends);
    const all = useSelector(getFriendsAndWannebies);
    //  console.log("test", test);
    useEffect(() => {
        dispatch(getFriendsList());
    }, []);
    return (
        <div className="friendslist">
            {friends.map((friend) => (
                <div key={friend.id}>{friend.last}</div>
            ))}
            {all.map((friend) => (
                <div key={friend.id}>{friend.last}</div>
            ))}
        </div>
    );
}
