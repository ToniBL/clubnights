import axios from "./axios";
import { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Colorpicker() {
    const [color, setColor] = useState("");

    const handleChange = (e) => {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name", e.target.name);
        setColor({
            [e.target.name]: e.target.value,
        });
    };

    useEffect(async () => {
        console.log("Color", color);
        return () => {
            console.log("color:", color);
        };
    }, [color]);

    const changeColor = (e) => {
        //console.log("color picked:" color);
        e.preventDefault();
        socket.emit("color", color);
        e.target.value = "";
    };

    return (
        <section className="colorpicker">
            Hey dancemachine, choose a color and get freaky
            <input
                name="color"
                type="color"
                id="color-picker"
                onChange={handleChange}
            ></input>
            <button onClick={(e) => changeColor(e)}>Select</button>
        </section>
    );
}
