import React from "react";
import Logo from "./logo";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";

//class component for app
// logo, profile-pic, uploader in here
// main component that hands down props to instances

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        //axios  fetch current user's data from db -> check sessions.id, make db query in get request
        // put returned data into state


        this.setState({});
    }

    render() {
        console.log("this.state in app:", this.state);
        if(!this.state.id) { return:null;}
        return (
            <div>
                <Logo />
                <ProfilePic profilePicUrl={this.state.profilePic} />
                <Uploader />
            </div>
        );
    }
}
