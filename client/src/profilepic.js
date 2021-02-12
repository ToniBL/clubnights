// function component
export default function Profilepic(props) {
    return (
        <div className="Profile-pic">
            <img
                className="profile-img"
                src={props.img_url || "defaultuser.png"}
                alt={`${props.first} ${props.last}`}
            ></img>
        </div>
    );
}
