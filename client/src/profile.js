import ProfilePic from "./profilepic";
import Bioedit from "./bioedit";

export default function Profile({
    id,
    profilePicUrl,
    first,
    last,
    toggleUploader,
    size,
    bio,
    setBio,
}) {
    // console.log("props in profile:", props);
    // console.log("props.bio:", props.bio);
    return (
        <div className="profile-component">
            <h1>{`${first} ${last}`}</h1>
            <div className={`profile-component-pic ${size}`}>
                <ProfilePic
                    id={id}
                    first={first}
                    last={last}
                    profilePicUrl={profilePicUrl}
                    size="large"
                    toggleUploader={toggleUploader}
                />

                <Bioedit bio={bio} setBio={setBio} />
            </div>
        </div>
    );
}
