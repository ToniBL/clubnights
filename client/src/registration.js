// class-component, because they have state and lifecycle methods, which we need

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Login from "./login";

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
                    location.replace("/dancefloor");
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
            <section className="entrance">
                {this.state.err && (
                    <p className="error">
                        ERROR: Something went wrong please try again
                    </p>
                )}

                <div className="queue">
                    <h1>regular queue</h1>
                    <div className="registration-form">
                        <input
                            className="input-entrance"
                            onChange={(e) => this.handleChange(e)}
                            name="first"
                            type="text"
                            placeholder="first"
                        ></input>
                        <input
                            className="input-entrance"
                            onChange={(e) => this.handleChange(e)}
                            name="last"
                            type="text"
                            placeholder="last"
                        ></input>
                        <input
                            className="input-entrance"
                            onChange={(e) => this.handleChange(e)}
                            name="email"
                            type="text"
                            placeholder="email"
                        ></input>
                        <input
                            className="input-entrance"
                            onChange={(e) => this.handleChange(e)}
                            name="password"
                            type="password"
                            placeholder="password"
                        ></input>
                        <button
                            className="btn-entrance"
                            onClick={() => this.handleClick()}
                        >
                            submit
                        </button>
                    </div>
                </div>

                <Login />
            </section>
        );
    }
}
