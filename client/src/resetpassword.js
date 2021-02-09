// class component because we will need diff states
import React from "react";

export default class ResetPassword extends React.Component {
    cosntructor() {
        super();
        this.state = {
            renderView = 1
        };
    }

    decidePasswordView () {
        if(this.state.renderView === 1) {
           return ( <div>
                <input name="email" />
                <button></button>
            </div>
            )
        } else if (this.state.renderView === 2) {
            return (
                <div>
                <input name="email" />
                <input name="code" />
                <button></button>
            </div>
            )
        } else if (this.state.renderView === 3) {
            return (
                <div>
                <p>successful reset</p>
            </div>
            )
    }
    // render 3 different views conditionally 
    render() {
        return (
            <div>
                <h1>reset password</h1>
            {this.decidePasswordView()}
            </div>
        );
    }
}
