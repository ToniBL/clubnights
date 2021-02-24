//import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise"; //allows async and await within actions
import { composeWithDevTools } from "redux-devtools-extension";
// code from encounter hooks 2 to use hooks in login and registration, more in classnotes
// import { useStatefulFields } from "./hooks/useStatefulFields";
// import { useAuthSubmit } from "./hooks/useAuthSubmit";

import Welcome from "./welcome";
import App from "./app";

import { reducer } from "./reducer";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
//console.log(elem);
ReactDOM.render(elem, document.querySelector("main"));
