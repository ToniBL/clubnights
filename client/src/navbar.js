import Logo from "./logo";
// import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import { NavLink } from "react-router-dom";
// import Logout from "./logout";
// import Friends from "./friends";

export default function Navbar({
    id,
    profile_pic_url,
    first,
    last,
    toggleUploader,
    size,
}) {
    return (
        <section className="header">
            <nav className="navbar">
                <Logo className="logo" />
                <div className="navelements">
                    <div className="navitem">
                        <NavLink style={{ textDecoration: "none" }} to="/">
                            <p>Home</p>
                        </NavLink>
                    </div>
                    <div className="navitem">
                        <NavLink
                            style={{ textDecoration: "none" }}
                            to="/friendslist"
                        >
                            <p>Friends </p>
                        </NavLink>
                    </div>
                    <div className="navitem">
                        <NavLink style={{ textDecoration: "none" }} to="/users">
                            <p> Search</p>
                        </NavLink>
                    </div>
                    <div className="navitem">
                        <NavLink style={{ textDecoration: "none" }} to="/chat">
                            <p> Chat</p>
                        </NavLink>
                    </div>
                    <div className="navitem">
                        <a href="/logout">Logout</a>
                    </div>
                </div>
                <div className={`profile-pic${size}`}>
                    <ProfilePic
                        id={id}
                        first={first}
                        last={last}
                        profile_pic_url={profile_pic_url}
                        size="small"
                        toggleUploader={toggleUploader}
                    />
                </div>{" "}
            </nav>
            <p className="greeting">
                Namaste, {first} {last}! Good to see you!
            </p>
        </section>
    );
}
