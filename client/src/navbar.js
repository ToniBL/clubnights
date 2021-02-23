import Logo from "./logo";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";

export default function Navbar({
    id,
    profilePicUrl,
    first,
    last,
    toggleUploader,
    size,
}) {
    return (
        <div className="navbar">
            <Logo />
            <p>
                Namaste, {first} {last} good to see you!
            </p>
            <div className={`profile-pic${size}`}>
                <ProfilePic
                    id={id}
                    first={first}
                    last={last}
                    profilePicUrl={profilePicUrl}
                    size="small"
                    toggleUploader={toggleUploader}
                />
            </div>
        </div>
    );
}
