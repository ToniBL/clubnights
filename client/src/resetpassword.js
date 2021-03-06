// class component because we will need diff states
import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPw: "",
            email: "",
            code: "",
            renderView: 1,
            err: false,
        };
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        // console.log(this.state);
    }

    checkOldMail() {
        console.log("submit clicked");
        axios
            .post("/resetpassword", this.state)
            .then((resp) => {
                console.log("resp.data from server:", resp.data);
                if (resp.data.err) {
                    return this.setState({ err: true });
                } else {
                    return this.setState({
                        renderView: 2,
                    });
                }
            })
            .catch((err) => {
                console.log("err in checkOldMail:", err);
            });
    }

    updatePw() {
        console.log("reset PW clicked");
        axios.post("/updatepassword", this.state).then((resp) => {
            console.log("resp.data from server update PW:", resp.data);
            if (resp.data.err || !resp.data.resetPw) {
                return this.setState({ err: true });
            } else {
                return this.setState({
                    renderView: 3,
                });
            }
        });
    }

    decidePasswordView() {
        if (this.state.renderView === 1) {
            return (
                <div>
                    {this.state.err && (
                        <p> ERROR: Something went wrong please try again</p>
                    )}
                    <p>
                        Please enter the email address with which you registered
                    </p>

                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="email"
                        name="email"
                    />
                    <button onClick={() => this.checkOldMail()}>Submit</button>
                </div>
            );
        } else if (this.state.renderView === 2) {
            return (
                <div>
                    <p>Please enter the code you received via email</p>
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        name="code"
                    />
                    <p>Please enter a new password</p>
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        name="newPw"
                    />

                    <button onClick={() => this.updatePw()}>
                        reset password
                    </button>
                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <p>
                        You successfully reset your password. Please{" "}
                        <Link to="/login">log in</Link>with your new password
                    </p>
                </div>
            );
        }
    }
    // render 3 different views conditionally
    render() {
        return (
            <div>
                <h1>Reset password</h1>
                {this.decidePasswordView()}
            </div>
        );
    }
}
