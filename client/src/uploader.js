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
        this.uploadPic = this.uploadPic.bind(this);
    }

    handleChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    uploadPic() {
        //e.preventDefault();
        let formData = new FormData();
        formData.append("file", this.state.file);
        console.log("this.state.file:", formData);
        var that = this;
        axios
            .post("/profilepic", formData)
            .then((resp) => {
                console.log("uploader resp.data:", resp.data);
                that.props.setProfilePicUrl(resp.data.rows);
            })
            .catch((err) => {
                console.log("err in axios aploader:", err);
                that.setState({ err: true });
            });
    }

    render() {
        return (
            <div className="uploader">
                {this.state.err && (
                    <p> ERROR: Something went wrong please try again</p>
                )}
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => this.handleChange(e)}
                />

                <button
                    className="pic-upload"
                    onClick={(e) => this.uploadPic(e)}
                >
                    Upload
                </button>
            </div>
        );
    }
}
