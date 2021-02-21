// function component
export default function ProfilePic({
    profilePicUrl,
    first,
    last,
    toggleUploader,
    size,
}) {
    //  console.log("props in profilepic", props);
    return (
        <div className={`profile-pic-box ${size}`}>
            <img
                className="profile-pic"
                src={profilePicUrl || "002-ganesha.svg"}
                alt={`${first} ${last}`}
                onClick={toggleUploader}
            ></img>
        </div>
    );
}
