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
            .get(`/api/otheruser/${this.props.match.params.id},`)
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
        console.log("this.state in otherprofile:", this.state);
        // console.log("this.props in other profile:" this.props)
        //  if (this.state.id) {
        return (
            <div className="otherProfile">
                <img
                    src={this.state.profilePicUrl}
                    alt={`${this.state.first} ${this.state.last}`}
                />

                <h3>
                    {this.state.first}
                    {this.state.last}
                </h3>
                <p>{this.state.bio}</p>
            </div>
        );
        // }
    }
}
