import React from "react";
import axios from "./axios";

export default class Bioedit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            editVisible: false,
            first: this.props.first,
            last: this.props.last,
            bio: this.props.bio,
        };

        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    componendDidMount() {
        console.log("bioEdit mounted props:", this.props);
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

    // in setState nicht bio setzen, das passiert in setBio function
    uploadBio() {
        //axios similar to pic upload
        console.log("this.state in upload BIO:", this.state);
        axios
            .post("/api/bio", this.state)
            .then((resp) => {
                console.log("uploadBio resp.data:", resp.data);
                this.setState({
                    editVisible: false,
                });
                this.props.setBio(resp.data.bio);
            })
            .catch((err) => {
                console.log("err in axios upload bio:", err);
                this.setState({ err: true });
            });
    }

    render() {
        if (this.state.editVisible) {
            console.log("this State in render bioedit:", this.state);
            return (
                <div className="bioedit">
                    {this.state.err && (
                        <p> ERROR: Something went wrong please try again</p>
                    )}
                    <textarea
                        className="edit"
                        name="bio"
                        onChange={(e) => this.handleChange(e)}
                        //if there is a bio in db insert, else default
                        //
                        defaultValue={
                            this.props.bio
                                ? this.props.bio
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
            // display mode: textarea hidden
            <div className="textbio">
                {this.state.err && (
                    <p> ERROR: Something went wrong please try again</p>
                )}
                <p className="text">{this.props.bio}</p>
                <button className="bio" onClick={() => this.toggleEditMode()}>
                    {this.props.bio ? "Edit Bio" : "Add Bio"}
                </button>
            </div>
        );
    }
}
