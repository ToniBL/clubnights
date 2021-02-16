import ProfilePic from "./profilepic";
import Bioedit from "./bioedit";

export default function Profile(props) {
    console.log("props in profile:", props);
    console.log("props.bio:", props.bio);
    return (
        <div className="border-red">
            <h1>I am the profile component</h1>
            <ProfilePic
                id={props.id}
                first={props.first}
                last={props.last}
                profilePicUrl={props.profilePicUrl}
                size="large"
                toggleUploader={props.toggleUploader}
            />
            <Bioedit bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
