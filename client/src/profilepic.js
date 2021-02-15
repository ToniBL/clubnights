// function component
export default function ProfilePic(props) {
    console.log("props", props);
    return (
        <div className="Profile-pic border-blue">
            <img
                className="profile-img"
                src={props.profilePicUrl || "defaultuser.png"}
                alt={`${props.first} ${props.last}`}
                onClick={props.toggleUploader}
            ></img>
        </div>
    );
}
