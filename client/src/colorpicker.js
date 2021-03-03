import axios from "./axios";
import { useState, useEffect } from "react";
import { socket } from "./socket";

const Colorpicker = () => {
    // here comes the css custom property action
    // first create a state property which holds the color prop
    const [color, setColor] = useState("#000");

    const handleChange = (e) => {
        setColor(e.target.value);
    };

    // target is to set the new values for the colors each time it changes
    useEffect(() => {
        // we will change here the values of the css custom properties
        // since we define them ourselfs we know the names ;)
        // setting background color
        document.documentElement.style.setProperty(
            // same name as in css
            "--square-color",
            // new value from our state
            color
        );
    }, [color]);

    const changeColor = (e) => {
        //console.log("color picked:" color);
        e.preventDefault();
        socket.emit("color", color);
    };

    return (
        <div className="box">
            <div className="wrapper">
                <span>choose a color and get freaky ! </span>
                <input
                    className="colorpicker-input"
                    type="color"
                    onChange={handleChange}
                />
                <button
                    className="select-color"
                    onClick={(e) => changeColor(e)}
                >
                    select
                </button>
            </div>
        </div>
    );
};

export default Colorpicker;

// import axios from "./axios";
// import { useState, useEffect } from "react";
// import { socket } from "./socket";

// export default function Colorpicker() {
//     const [color, setColor] = useState("");

//     const handleChange = (e) => {
//         console.log("e.target.value", e.target.value);
//         console.log("e.target.name", e.target.name);
//         setColor({
//             [e.target.name]: e.target.value,
//         });
//     };

//     useEffect(async () => {
//         console.log("Color", color);
//         return () => {
//             console.log("color:", color);
//         };
//     }, [color]);

//     const changeColor = (e) => {
//         //console.log("color picked:" color);
//         e.preventDefault();
//         socket.emit("color", color);
//         e.target.value = "";
//     };

//     return (
//         <section className="colorpicker">
//             choose a color and get freaky!
//             <input
//                 name="color"
//                 type="color"
//                 id="color-picker"
//                 onChange={handleChange}
//             ></input>
//             <button className="select-color" onClick={(e) => changeColor(e)}>
//                 Select
//             </button>
//         </section>
//     );
// }
