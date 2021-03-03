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
import ReactPlayer from "./dj";

export default function Dancefloor() {
    // state with dancers // neuer dancer (array.find / filter): alte spreaden und neue dazu// neue koordinaten: dancer/farbe-bewegung updaten

    const rows = times(16);
    const columns = times(16);

    const [coordinates, setCoordinates] = useState({});
    const [dancers, setDancers] = useState([]);

    const elemRef = useRef();

    useEffect(() => {
        elemRef;
        socket.on("newDancer", (dancerObj) => {
            console.log("dancerObj:", dancerObj);
            setDancers([...dancers, dancerObj]);
        });
    }, []);

    useEffect(() => {
        console.log("dancers got updated:", dancers);
    }, [dancers]);

    const handleMouseEnter = (indexRow, indexCol) => {
        console.log(indexRow, indexCol);
        setCoordinates({ indexRow, indexCol });
        socket.emit("coordinates", coordinates);
    };

    const isDancer = (indexRow, indexCol) => {
        // check iscol/row -> false = black / true = color

        let results = dancers.map(({ row, col, color }) => {
            const isCol = col === indexCol;
            const isRow = row === indexRow;
            return isCol && isRow ? color : "";
        });
        results.filter((result) => result);
        // all empty strings are falsy, string with color is truthy
        return results[0] || false;
    };

    // setInterval(function () {
    //     var colors = ["white", "black", "hotpink", "limegreen"];
    //     document.body.style.backgroundColor =
    //         colors[Math.floor(Math.random() * colors.length)];
    // }, 1000);

    return (
        <section className="club">
            <button
                className="select-color"
                onClick={() => {
                    setInterval(function () {
                        var colors = ["white", "black", "hotpink", "limegreen"];
                        document.body.style.backgroundColor =
                            colors[Math.floor(Math.random() * colors.length)];
                    }, 80);
                }}
            >
                strobo
            </button>
            <button
                className="select-color"
                onClick={() => {
                    setInterval(function () {
                        var colors = ["rgb(66, 43, 66)", "rgb(46, 38, 46)"];
                        document.body.style.backgroundColor =
                            colors[Math.floor(Math.random() * colors.length)];
                    }, 8000);
                }}
            >
                stop
            </button>
            <Colorpicker />
            <ReactPlayer />
            <div className="dancefloor">
                {" "}
                {rows.map((_, indexRow) =>
                    columns.map((_, indexCol) => (
                        <div
                            className={`square ${
                                isDancer(indexRow, indexCol) ? "dancer" : ""
                            }`}
                            style={{
                                backgroundColor: `${
                                    isDancer(indexRow, indexCol) || ""
                                }`,
                                boxShadow: `0 0 2px #000`,
                            }}
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
