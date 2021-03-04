import ReactPlayer from "react-player";

function Lounge() {
    return (
        <div>
            <ReactPlayer
                className="player"
                url="/music/14498658_La La Land_(Layton Giordani Remix).mp3"
                width="200px"
                height="20px"
                playing={true}
                controls={true}
            />
        </div>
    );
}

export default Lounge;
