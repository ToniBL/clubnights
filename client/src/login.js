import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            err: false,
        };
    }

    handleChange(e) {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState:", this.state)
        );
    }

    clickLogin() {
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("resp.data from server:", resp.data);
                if (resp.data.err) {
                    return this.setState({ err: true });
                } else {
                    return location.replace("/");
                }
            })
            .catch((err) => {
                console.log("err in clickLogin:", err);
            });
    }

    render() {
        return (
            <div>
                {this.state.err && (
                    <p> ERROR: Something went wrong please try again</p>
                )}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="email"
                ></input>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                ></input>
                <button onClick={() => this.clickLogin()}>Login</button>
                Click<Link to="/"> here </Link>to register! Click
                <Link to="/resetpassword"> here </Link>if you forgot your
                password!
            </div>
        );
    }
}
