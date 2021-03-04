import ReactPlayer from "react-player";

function Player() {
    return (
        <div>
            <ReactPlayer
                className="player"
                url="/music/14079272_Oh Ohh_(Original Mix).mp3"
                width="200px"
                height="20px"
                playing={false}
                controls={true}
            />
        </div>
    );
}

export default Player;
