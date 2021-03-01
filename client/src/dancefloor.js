// holds the color panel, reacts to mouseenter and mouseout // sends info about mouse location to server

// useState to update coordinates in state
// useEffect runs whenever coordinates get updated
// useEffect then somehow ueses useRef to update the DOM e.a. to color the square (BIG QUESTIONMARK? Or does this updating happening serverside?)
// handleMouseEnter emits the coordinates to socket
// QUESTION: When exactly does setCoordinates get called? Can I have two events on Mouseenter?

import { times } from "lodash";
import { socket } from "./socket";

import { useState, useEffect, useRef } from "react";
import Colorpicker from "./colorpicker";

// const colors = ["#e74c3c", "#8e44ad", "3498db", "#e67e22"];

export default function Dancefloor() {
    const rows = times(20);
    const columns = times(20);

    const [coordinates, setCoordinates] = useState({});

    const elemRef = useRef();

    useEffect(() => {
        elemRef;
    }, [coordinates]);

    const handleMouseEnter = (indexRow, indexCol) => {
        console.log(indexRow, indexCol);
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
                                handleMouseEnter({ indexRow, indexCol })
                            }
                        ></div>
                    ))
                )}
            </div>
        </section>
    );
}
