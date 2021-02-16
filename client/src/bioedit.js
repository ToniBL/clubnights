import React from "react";
import axios from "./axios";

export default class Bioedit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            editVisible: false,
            bio: this.props.bio,
        };

        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    toggleEditMode() {
        this.setState({ editVisible: !this.state.editVisible });
    }

    handleChange(e) {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name", e.target.name); // shows input field according to name we choose for name in input
        // this.setState is used to put/update state
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState:", this.state)
        );
    }

    uploadBio() {
        //axios similar to pic upload
        console.log("this.state in upload BIO:", this.state);
        axios
            .post("/api/bio", this.state)
            .then((resp) => {
                console.log("uploadBio resp.data:", resp.data);
                this.setState({
                    bio: resp.data.bio,
                    editVisible: false,
                });
            })
            .catch((err) => {
                console.log("err in axios upload bio:", err);
                this.setState({ err: true });
            });
    }

    render() {
        if (this.state.editVisible) {
            return (
                <div className="bioedit">
                    <textarea
                        className="edit"
                        name="bio"
                        onChange={(e) => this.handleChange(e)}
                        //if there is a bio in db insert, else default
                        //
                        defaultValue={
                            this.state.bio
                                ? this.state.bio
                                : "Enter your bio here"
                        }
                    />

                    <button
                        className="bio-upload"
                        onClick={(e) => this.uploadBio(e)}
                    >
                        Save
                    </button>
                </div>
            );
        }

        return (
            <div className="textbio">
                <p className="text">{this.state.bio}</p>
                <button className="bio" onClick={() => this.toggleEditMode()}>
                    {this.state.bio ? "Edit Bio" : "Add Bio"}
                </button>
            </div>
        );
    }
}
