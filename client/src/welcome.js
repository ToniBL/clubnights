import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Resetpassword from "./resetpassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <img src="/logo.png" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={Resetpassword} />
                </div>
            </HashRouter>
        </div>
    );
}
