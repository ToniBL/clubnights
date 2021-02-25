// class-component, because they have state and lifecycle methods, which we need

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            err: false,
        };
    }

    handleChange(e) {
        // console.log("e.target.value", e.target.value);
        // console.log("e.target.name", e.target.name); // shows input field according to name we choose for name in input
        // this.setState is used to put/update state
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState:", this.state)
        );
    }

    handleClick() {
        // with submit we trigger axios to server to pass input value to db
        // check input before axios
        this.err = false;

        axios
            .post("/registration", this.state)
            .then((resp) => {
                console.log("resp.data from server:", resp.data);
                // err still needs to be defined
                if (resp.data.err == true) {
                    console.log("err no resp data");
                    this.setState({
                        err: true,
                    });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("err in catch of axios post registration:", err);
                this.setState({
                    err: true,
                });
            });
    }

    render() {
        return (
            <section className="registration">
                {this.state.err && (
                    <p> ERROR: Something went wrong please try again</p>
                )}
                <div className="Welcome-text">
                    <h1 className="welcome">Welcome to Breathe</h1>
                    <p className="subtitle">
                        {" "}
                        a socialnetwork for humans breathing and making a fuss
                        about it{" "}
                    </p>
                </div>
                <div className="registration-form">
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="first"
                        type="text"
                        placeholder="first"
                    ></input>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="last"
                        type="text"
                        placeholder="last"
                    ></input>
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
                    <button onClick={() => this.handleClick()}>submit</button>
                </div>
                Allready registered? <Link to="/login">Log in!</Link>
            </section>
        );
    }
}
