import React from "react";
import axios from "./axios";

//class component for app
// logo, profile-pic, uploader in here

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            err: false,
        };
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

    uploadPic() {
        //  e.preventDefault();
        let formData = new FormData();
        formData.append("file", this.state.file);
        console.log("this.state.file:", formData);
        axios
            .post("/profilepic", formData)
            .then((resp) => {
                console.log("uploader resp.data.rows:", resp.data.rows);
                this.props.setProfilePicUrl(resp.data.rows);
            })
            .catch((err) => {
                console.log("err in axios aploader:", err);
                this.setState({ err: true });
            });
    }

    render() {
        return (
            <div className="uploader">
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => this.handleChange(e)}
                />

                <button
                    className="pic-ipload"
                    onClick={(e) => this.uploadPic(e)}
                >
                    Upload
                </button>
            </div>
        );
    }
}
