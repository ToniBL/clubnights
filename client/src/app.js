import React from "react";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";

//class component for app
// logo, profile-pic, uploader in here
// main component that hands down props to instances

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            profile_pic_url: "",
            uploaderVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind;
    }

    componentDidMount() {
        // console.log("app did mount");
        axios
            .get("/api/user", this.state)
            .then((resp) => {
                console.log("resp.data from /api/user:", resp.data);
                this.setState(resp.data.rows);
            })
            .catch((err) => {
                console.log("err in axios api user:", err);
            });
        //axios  fetch current user's data from db -> check sessions.id, make db query in get request
        // put returned data into state
    }

    // DidUpdate is called after DidMount, takes 2 arguments: prev.props & prev.state; inside method we perform conditional check: e.a. if(prevState.url !== this.state.url) {console.log("state changed")}
    //componentDidUpdate()

    render() {
        console.log("this.state in app:", this.state);
        // if(!this.state.id) { return null;} -> have a blank page until data from server arrives
        return (
            <div className="app">
                <Logo />
                <ProfilePic
                    id={this.state.id}
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.profile_pic_url}
                    size="small"
                    onClick={() => this.toggleUploader}
                />
                <Uploader />
            </div>
        );
    }
}
