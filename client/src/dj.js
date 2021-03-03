import ReactPlayer from "react-player";

function Player() {
    return (
        <div className="DJ">
            <ReactPlayer
                url="/music/14079272_Oh Ohh_(Original Mix).mp3"
                width="400px"
                height="50px"
                playing={false}
                controls={true}
            />
        </div>
    );
}

export default Player;
