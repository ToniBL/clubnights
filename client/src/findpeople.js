import { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [newUser, setNewUser] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [searchUser, setSearchUser] = useState();
}

useEffect(() => {
    console.log("findPeople mounting");
    axios
        .get("/newuser")
        .then((resp) => {
            console.log("resp.data:", resp.data);
            setNewUser(resp.data.rows);
        })
        .catch((err) => console.log("err in axios newuser:", err));
}, []); //empty array to run useEffect only once

// add second query for user by name 

render () {
    return (

        // need to map results here 

    )
}
