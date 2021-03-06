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
                    <div>
                        <NavLink
                            style={{ textDecoration: "none" }}
                            to="/chat"
                            className="navitem"
                            activeClassName="activeRoute"
                            activeStyle={{ color: "black" }}
                        >
                            bar
                        </NavLink>
                    </div>
                    <div>
                        <NavLink
                            style={{ textDecoration: "none" }}
                            to="/dancefloor"
                            className="navitem"
                            activeClassName="activeRoute"
                            activeStyle={{ color: "black" }}
                        >
                            dancefloor
                        </NavLink>
                    </div>
                    <div>
                        <a
                            href="/logout"
                            className="navitem"
                            activeClassName="activeRoute"
                            activeStyle={{ color: "black" }}
                        >
                            exit
                        </a>
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
            <div className="greeting">
                <div className="greeting-text">
                    Namaste, {first} {last}! Good to see you!
                </div>
            </div>
        </section>
    );
}
