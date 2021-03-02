// holds the color panel, reacts to mouseenter and mouseout // sends info about mouse location to server

// useState to update coordinates in state
// useEffect runs whenever coordinates get updated
// useEffect then somehow ueses useRef to update the DOM e.a. to color the square (BIG QUESTIONMARK? Or does this updating happening serverside?)
// handleMouseEnter emits the coordinates to socket

// dancer [] get's updated with every useEffect / setDancer
// check array for new dancer (id), if new dancer spread into existing array
// match id, color and coordinates and update accordingly
// add default colour

import { times } from "lodash";
import { socket } from "./socket";

import { useState, useEffect, useRef } from "react";
import Colorpicker from "./colorpicker";

export default function Dancefloor() {
    // state with dancers // neuer dancer (array.find / filter): alte spreaden und neue dazu// neue koordinaten: dancer/farbe-bewegung updaten

    const rows = times(20);
    const columns = times(20);

    const [coordinates, setCoordinates] = useState({});
    const [dancer, setDancers] = useState([]);

    const elemRef = useRef();

    useEffect(() => {
        elemRef;
        socket.on("newDancer", (dancerObj) => {
            console.log("dancerObj:", dancerObj);

            for (let i = 0; i < dancer.length; i++) {}
        });
    }, [coordinates]);

    const handleMouseEnter = (indexRow, indexCol) => {
        console.log(indexRow, indexCol);
        setCoordinates({ indexRow, indexCol });
        socket.emit("coordinates", coordinates);
    };

    return (
        <section className="club">
            {" "}
            <Colorpicker />
            <div className="dancefloor">
                {" "}
                {rows.map((_, indexRow) =>
                    columns.map((_, indexCol) => (
                        <div
                            className="square"
                            key={`id-${indexRow}-${indexCol}`}
                            indexrow={`${indexRow}`}
                            indexcol={`${indexCol}`}
                            ref={elemRef}
                            onMouseEnter={() =>
                                handleMouseEnter(indexRow, indexCol)
                            }
                        ></div>
                    ))
                )}
            </div>
        </section>
    );
}
