const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { SecretsManager } = require("aws-sdk");
const csurf = require("csurf");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");

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
// csurf comment out for Part 1 finishing
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//Debug Middleware: what url get's requested and what cookies do we have?
// app.use((req, res, next) => {
//     console.log("req.url", req.url);
//     console.log("req.session:", req.session);

//     next();
// });

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        console.log("redirecting to '/'");
        res.redirect("/");
    } else {
        // user not logged in, no redirect
        // after sendFile (sending HTML back as response) runs start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    hash(req.body.password)
        .then((hashedPw) => {
            console.log("hashedPW in register:", hashedPw);
            db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPw
            ).then((result) => {
                console.log("result:", result);
                req.session.userId = result.rows[0].id;
                console.log("req.session.userId:", req.session.userId);
                res.json(result);
            });
        })

        .catch((err) => {
            console.log("err in registerUser:", err);
            res.json({ err: true });
        });
});

app.post("/login", (req, res) => {
    console.log("req.body in login:", req.body);
    const password = req.body.password;
    db.loginUser(req.body.email)
        .then((result) => {
            let hashedPw = result.rows[0].password;
            return compare(password, hashedPw)
                .then((match) => {
                    console.log("match value from compare:", match);
                    if (match) {
                        req.session.userId = result.rows[0].id;
                        return res.json({ succsess: true });
                    } else {
                        console.log("err in matchPw:");
                        res.json({ err: true });
                    }
                })
                .catch((err) => {
                    console.log("err catch matchPw:", err);
                    res.json({ err: true });
                });
        })
        .catch((err) => {
            console.log("err in loginUser:", err);
            return res.json({ err: true });
        });
});

app.post("/resetpassword", (req, res) => {
    console.log("req.body.email:", req.body.email);
    db.checkEmail(req.body.email)
        .then((result) => {
            console.log("result.rows[0].email:", result.rows[0].email);

            if (result.rows[0].email == req.body.email) {
                //  res.json({ emailckecked: true });
                console.log("mailchecked");
            }
            //else {
            //     res.json({ checkmailfailed: true });
            // }
            const email = req.body.email;
            const secretCode = cryptoRandomString({
                length: 6,
            });
            console.log(secretCode);
            db.saveCode(email, secretCode)
                // .console.log("saving code")
                .then(
                    sendEmail(
                        email,
                        `Please use this code to reset your password ${secretCode}`,
                        "Reset code for your xy account"
                    )
                )
                .then(res.json({ emailsent: true }))
                .catch((err) => {
                    console.log("err in saveCode:", err);
                    res.json({ err: true });
                });
        })
        .catch((err) => {
            console.log("err in checkMail:", err);
            res.json({ err: true });
        });
});

app.post("/updatepassword", (req, res) => {
    console.log("update PW req.body:", req.body);
    db.checkCode(req.body.email)
        .then((result) => {
            console.log("result.rows[0]:", result.rows[0].code);
            const { code } = result.rows[0];
            if (req.body.code === code) {
                console.log("same code!");
                hash(req.body.newPw)
                    .then((hashedPw) => {
                        db.changePw(hashedPw, req.body.email);
                        console.log("hashedPw", hashedPw);
                    })
                    .then(res.json({ resetPw: true }))
                    .catch((err) => {
                        console.log("err in changePW:", err);
                    });
            } else {
                console.log("not same code!");
                res.json({ resetPw: false });
            }
        })
        .catch((err) => {
            console.log("err in checkCode:", err);
            res.json({ err: true });
        });
});

app.get("/api/user", (req, res) => {
    db.getUserData(req.sessions.userId)
        .then((result) => {
            console.log("result.rows api/user:", result.rows);
            res.json({ getData: true });
        })
        .catch((err) => {
            console.log("err in /api/user:", err);
            res.json({ err: true });
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
