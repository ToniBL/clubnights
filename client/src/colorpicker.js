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

    // chooseColor() {
    //         axios
    //             .post("/colorpicker", this.state)
    //             .then((resp) => {
    //                 console.log("resp.data from server:", resp.data);
    //                 if (resp.data.err) {
    //                     return this.setState({ err: true });
    //                 } else {
    //                     return location.replace("/");
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log("err in clickLogin:", err);
    //             });
    //     }

    useEffect(async () => {
        console.log("Color", color);
        return () => {
            console.log("color:", color);
        };
    }, [color]);

    // return (
    //     <section className="Colorpicker">
    //         <input
    //             type="color"
    //             id="color-picker"
    //             onChange={(e) => this.handleChange(e)}
    //             color="color"
    //         ></input>
    //         <button onClick={() => this.clickLogin()}>Select</button>
    //     </section>
    // );

    const changeColor = (e) => {
        //console.log("color picked:" color);
        e.preventDefault();
        socket.emit("color", color);
        e.target.value = "";
    };

    return (
        <section className="colorpicker">
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
