const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { SecretsManager } = require("aws-sdk");

let cookie_sec;
if (process.env.cookie_secret) {
    // we are in production
    cookie_sec = process.env.cookie_secret;
} else {
    cookie_sec = require("./secrets.json").sessionSecret;
}

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json());

app.use(
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        // user not logged in, no redirect
        // after sendFile (sending HTML back as response) runs start.js
        res.sendFile(path.join(__dirname, "...", "client", "index.html"));
    }
});

//*route handles all not specified routes
app.get("*", function (req, res) {
    // if user is not logged in redirect to /welcome
    if (!req.session.sessionId) {
        res.redirect("/welcome");
    } else {
        // if user is logged in, send HTML, once client has HTML start.js renders p-tag on screen
    }
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.post("/registration", (req, res) => {
    hash(req.body.password)
        .then((hashedPw) => {
            console.log("hashedPW in register:", hashedPw);
            return db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPw
            );
        })
        .then((result) => {
            console.log("result:", result);
            req.sessionuserId = result.rows[0].id;
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("errin registerUser:", err);
            //  hier auch setState err:true?
        });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
