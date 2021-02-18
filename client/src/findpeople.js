import { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    // searchUser to monitor the input field
    // user for results array
    // first param in hooks is data in state (we want to update) , second param is a function to manipulate data in state
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState();

    useEffect(() => {
        console.log("findPeople mounting");
        let abort = false;

        (async () => {
            try {
                const { data } = await axios.get(`/api/users/${searchUser}`);
                console.log("data in axios findpeople:", data);
                if (!abort) {
                    setUsers(data);
                }
            } catch (err) {
                console.log("err in setSearchUser:", err);
            }
        })();

        //cleanup-function, runs before very re-render
        return () => {
            console.log("searchUser in returned function:", searchUser);
            abort = true;
        };
    }, [searchUser]);

    //empty array to run useEffect only once

    // add second query for user by name

    return (
        <div className="findPeople">
            <h2>Here are our latest members:</h2>
            <input
                name="findPeople"
                type="text"
                placeholder="find friends"
                onChange={(e) => setSearchUser(e.target.value)}
                autoComplete="off"
            />
            {users.map((elem) => {
                return (
                    <div key={elem.id}>
                        <img
                            src={elem.profile_pic_url}
                            alt={`${elem.first} ${elem.last}`}
                        />

                        <p>
                            {elem.first} {elem.last}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
