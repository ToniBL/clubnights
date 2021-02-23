//import ProfilePic from "./profilepic";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getFriendsList, acceptFriend, cancelFriend } from "./actions";
import { getFriendsAndPending, getFriends, getPending } from "./selectors";

import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(getFriends);
    const pending = useSelector(getPending);
    const all = useSelector(getFriendsAndPending);
    //  console.log("test", test);
    useEffect(() => {
        dispatch(getFriendsList());
    }, []);

    return (
        <div className="friendslist">
            <h2>Friends</h2>
            {friends.map((friend) => (
                <div key={friend.id}>
                    <Link>
                        <img src={friend.profile_pic_url}></img>
                    </Link>

                    <p>
                        {friend.first} {friend.last}{" "}
                    </p>

                    <p>
                        <button
                            onClick={() => dispatch(cancelFriend(friend.id))}
                        >
                            Cancel
                        </button>
                    </p>
                </div>
            ))}
            {/* <h2>Everyone</h2>
            {all.map((friend) => (
                <div key={friend.id}>
                    {friend.first}
                    {friend.last}
                </div>
            ))} */}
            <h2>Pending Friendrequests</h2>
            {pending.map((friend) => (
                <div key={friend.id}>
                    <Link>
                        <img src={friend.profile_pic_url}></img>
                    </Link>
                    <p>
                        {friend.first} {friend.last}{" "}
                    </p>

                    <p>
                        <button
                            onClick={() => dispatch(acceptFriend(friend.id))}
                        >
                            Accept
                        </button>
                    </p>
                </div>
            ))}
        </div>
    );
}
