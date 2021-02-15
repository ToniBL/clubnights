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
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const multer = require("multer");
const uidSafe = require("uid-safe");

// midleware to bring file in aws format

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

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
// creates file in uploads folder
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
//Debug Middleware: what url get's requested and what cookies do we have?
// app.use((req, res, next) => {
//     console.log("req.url", req.url);
//     console.log("req.session:", req.session);

//     next();
// });

//PART 1 REGISTRATION
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

// PART 2 LOGIN
app.post("/login", (req, res) => {
    console.log("req.body in login:", req.body);
    const password = req.body.password;
    console.log(password);
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

// PART 3 RESET PW
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
    //  console.log("update PW req.body:", req.body);
    db.checkCode(req.body.email)
        .then((result) => {
            // console.log("result.rows[0]:", result.rows[0].code);
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

// PART 4 IMG UPLOAD

app.get("/api/user", (req, res) => {
    // console.log("req.sessionID:", req.session.userId);
    db.getUserData(req.session.userId)
        .then((result) => {
            console.log("result api/user:", result);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("err in /api/user:", err);
            res.json({ err: true });
        });
});

app.post("/profilepic", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("req.body: ", req.body);
    // console.log("req.file: ", req.file);
    if (req.file) {
        // here sql insert
        req.body.url = s3Url + req.file.filename;
        db.imgToDb(req.body.url, req.session.userId)
            .then((result) => {
                // console.log("imgToDb res.rows:", result.rows);
                res.json({
                    rows: result.rows[0].profile_pic_url,
                    imgUpload: true,
                });
            })
            .catch((err) => {
                console.log("on server post profilepic:", err);
                res.json({ success: false });
            });
    }
});

// PART 5 UPLOAD & EDIT BIO

app.post("/api/bio", (req, res) => {
    console.log("req.body in post bio:", req.body);
    db.bioToDb(req.session.userId, req.body.bio)
        .then((result) => {
            // console.log("imgToDb res.rows:", result.rows);
            res.json({
                rows: result.rows[0].bio,
                bioUpload: true,
            });
        })
        .catch((err) => {
            console.log("err on server post bio:", err);
            res.json({ success: false });
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
