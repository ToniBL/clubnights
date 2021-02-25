import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Resetpassword from "./resetpassword";
//import Navbar from "./navbar";

export default function Welcome() {
    return (
        <div className="welcome">
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
