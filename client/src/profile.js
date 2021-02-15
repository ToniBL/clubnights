import ProfilePic from "./profilepic";
import Bioedit from "./bioedit";

export default function Profile() {
    return (
        <div>
            <h1>I am the profile component</h1>
            <ProfilePic
                id={this.state.id}
                first={this.state.first}
                last={this.state.last}
                profilePicUrl={this.state.profile_pic_url}
                size="large"
                toggleUploader={this.toggleUploader}
            />
            <Bioedit />
        </div>
    );
}
