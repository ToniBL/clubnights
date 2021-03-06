import React from "react";
import axios from "./axios";
import Navbar from "./navbar";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Logout from "./logout";
import Chat from "./chat";
import Dancefloor from "./dancefloor";

//class component for app
// logo, profile-pic, uploader in here
// main component that hands down props to instances

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            first: "",
            last: "",
            profile_pic_url: "",
            draftBio: "",
            uploaderVisible: false,
            color: "",
        };
        this.toggleUploader = this.toggleUploader.bind(this);

        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
        // function that needs to be passed as props to bioetid, so bioedit can call it
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        // console.log("app did mount");
        axios
            .get("/api/user", this.state)
            .then((resp) => {
                // console.log("resp.data from /api/user:", resp.data);

                this.setState({
                    id: resp.data.id,
                    first: resp.data.first,
                    last: resp.data.last,
                    profile_pic_url: resp.data.profile_pic_url,
                    bio: resp.data.bio,
                });
            })
            .catch((err) => {
                console.log("err in axios api user:", err);
            });
        //axios  fetch current user's data from db -> check sessions.id, make db query in get request
        // put returned data into state
    }

    // DidUpdate is called after DidMount, takes 2 arguments: prev.props & prev.state; inside method we perform conditional check: e.a. if(prevState.url !== this.state.url) {console.log("state changed")}
    //componentDidUpdate()

    setProfilePicUrl(profile_pic_url) {
        //  console.log("profile URL SET ", profilePicUrl);
        this.setState({
            profile_pic_url: profile_pic_url,
            uploaderVisible: false,
        });
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    setBio(bio) {
        //  console.log("bio set in app:", bio);
        this.setState({ bio: bio });
    }
    render() {
        // console.log("this.state in app:", this.state);
        // if(!this.state.id) { return null;} -> have a blank page until data from server arrives
        return (
            <div className="app">
                <BrowserRouter>
                    <Navbar
                        id={this.state.id}
                        first={this.state.first}
                        last={this.state.last}
                        profile_pic_url={this.state.profile_pic_url}
                        size="small"
                        toggleUploader={this.toggleUploader}
                    />
                    {this.state.uploaderVisible && (
                        <Uploader setProfilePicUrl={this.setProfilePicUrl} />
                    )}
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                profile_pic_url={this.state.profile_pic_url}
                                size="small"
                                bio={this.state.bio}
                                toggleUploader={this.toggleUploader}
                                setBio={this.setBio}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/users"
                        render={(props) => (
                            <FindPeople
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route path="/friendslist" render={() => <Friends />} />
                    <Route path="/chat" render={() => <Chat />} />
                    <Route
                        path="/dancefloor"
                        render={() => (
                            <Dancefloor
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                color={this.state.color}
                            />
                        )}
                    />
                    <Route path="/logout" render={() => <Logout />} />
                </BrowserRouter>
            </div>
        );
    }
}
