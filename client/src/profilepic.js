// function component
export default function ProfilePic(props) {
    return (
        <div className="Profile-pic">
            <img
                className="profile-img"
                src={props.profile_pic_url || "defaultuser.png"}
                alt={`${props.first} ${props.last}`}
                onClick={props.toggleUploader}
            ></img>
        </div>
    );
}
