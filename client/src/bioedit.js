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

        this.editMode = this.editMode.bind(this);
    }

    editMode() {
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
    }

    render() {
        if (this.state.editMode) {
            return (
                <div className="editbio">
                    <textarea
                        className="edit"
                        name="edit"
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
                <button className="bio" onClick={() => this.editMode()}>
                    Save
                </button>
            </div>
        );
    }
}
