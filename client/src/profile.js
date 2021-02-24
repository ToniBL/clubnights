import ProfilePic from "./profilepic";
import Bioedit from "./bioedit";

export default function Profile({
    id,
    profile_pic_url,
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
            <div className="banner-img">
                <div className={`profile-component-pic ${size}`}>
                    <ProfilePic
                        id={id}
                        first={first}
                        last={last}
                        profile_pic_url={profile_pic_url}
                        size="large"
                        toggleUploader={toggleUploader}
                    />
                    <div className="bio-text">
                        <h3>Mission-Statement</h3>
                        <Bioedit bio={bio} setBio={setBio} />
                    </div>
                </div>
                <h1>{`${first} ${last}`}</h1>
            </div>

            <div className="profile-content">
                <div className="image-galery"></div>
                <div className="comments"></div>
            </div>
        </div>
    );
}
