// function component
export default function ProfilePic({
    profile_pic_url,
    first,
    last,
    toggleUploader,
    size,
}) {
    console.log("props in profilepic", profile_pic_url);
    return (
        <div className={`profile-pic-box ${size}`}>
            <img
                className="profile-pic"
                src={profile_pic_url || "002-ganesha.svg"}
                alt={`${first} ${last}`}
                onClick={toggleUploader}
            ></img>
        </div>
    );
}
