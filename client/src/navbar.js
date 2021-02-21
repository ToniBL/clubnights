import Logo from "./logo";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";

export default function Navbar({
    id,
    profile_pic_url,
    first,
    last,
    toggleUploader,
    size,
}) {
    return (
        <div className="navbar">
            <Logo />
            <div className={`profile-pic${size}`}>
                <ProfilePic
                    id={id}
                    first={first}
                    last={last}
                    profile_pic_url={profile_pic_url}
                    size="small"
                    toggleUploader={toggleUploader}
                />
            </div>
        </div>
    );
}
