import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            first: this.props.first,
            last: this.props.last,
            profilePicUrl: this.props.profilePicUrl,
            bio: this.props.bio,
            err: false,
        };
    }

    // we should  make a request to our server to get the other user's data using the id
    // If we are trying to view our own profile,
    // we should make sure to send the user back to the '/' route
    componentDidMount() {
        console.log("this.props.match: ", this.props.match);
        console.log("id: ", this.props.match.params.id);
        axios
            .get(`/otheruser/${this.props.match.params.id}`)
            .then((resp) => {
                console.log("resp. in axios otherprofile:", resp);
                this.setState({
                    id: resp.data.rows.id,
                    first: resp.data.rows.first,
                    last: resp.data.rows.last,
                    profilePicUrl: resp.data.rows.profilePicUrl,
                    bio: resp.data.rows.bio,
                });
                if (this.props.match.params.id == resp.data.rows.cookies) {
                    this.props.history.push("/");
                }
            })

            .catch((err) => {
                console.log("err in axios otherProfile:", err);
                this.state({ err: true });
            });
    }

    render() {
        return (
            <div>
                <h1>I am the other profile!!!</h1>
                <h2>
                    I will display the other user's information including their
                    profile picture and bio but NOONE will be able to edit
                    information in here! cause it's not your profile to edit!
                </h2>
            </div>
        );
    }
}
