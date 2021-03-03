const express = require("express");
const app = express();
// we need a native nodeserver for initial handshake
//app get's "wrapped" in server / if you want to deplay on heroku you need to also allowRequest
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
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

// LAST FM API
// const LastFM = require("last-fm");
// const lastfm = new LastFM("92e33bef21762a90edba30a0aa37513c", {
//     userAgent: "MyApp/clubnights",
// });
// lastfm.trackSearch({ q: "control" }, (err, data) => {
//     if (err) console.log(err);
//     else console.log(data);
// });

///

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json());

// app.use(
//     cookieSession({
//         secret: cookie_sec,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );
const cookieSessionMiddleware = cookieSession({
    secret: cookie_sec,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
app.use((req, res, next) => {
    console.log("req.url", req.url);
    console.log("req.session:", req.session);

    next();
});

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
    if (
        req.body.first === "" ||
        req.body.last === "" ||
        req.body.email === "" ||
        req.body.password === ""
    ) {
        res.json({ err: true });
    }
    hash(req.body.password)
        .then((hashedPw) => {
            //   console.log("hashedPW in register:", hashedPw);
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
    //  console.log(password);
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

// COLORPICKER
app.post("/colorpicker", async (req, res) => {
    console.log("req.body in colorpicker:", req.body);

    try {
        const { color } = await db.chooseColor(
            req.session.userId,
            req.body.color
        );
        res.json({
            rows: result.rows[0].color,
        });
    } catch (err) {
        console.log("err on server post color:", err);
        res.json({ success: false });
    }
});

// PART 3 RESET PW
app.post("/resetpassword", (req, res) => {
    //  console.log("req.body.email:", req.body.email);
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
            // console.log("result api/user:", result);
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
    //   console.log("req.body in post bio:", req.body);
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

// PART 6 ROUTING

app.get("/api/otheruser/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log(typeof id);
    console.log("req.params.id:", req.params.id);
    console.log("req.session.userId:", req.session.userId);
    db.getUserData(id)
        .then((result) => {
            //  console.log("result in otheruser:", result.rows.length);
            res.json({
                rows: result.rows,
                cookie: req.session.userId,
                success: true,
            });
        })
        .catch((err) => {
            console.log("err in user:id", err);
            res.json({ err: true });
        });
});

// PART 7 FIND PEOPLE

app.get("/api/users/:inputVal?", async (req, res) => {
    // console.log("req.body.params:", req.body.params);
    let { inputVal } = req.params;
    try {
        if (!inputVal) {
            const { rows } = await db.lastUser();
            console.log("this are the 3 recent user:", rows);
            res.json(rows);
        } else {
            const { rows } = await db.searchUser(inputVal);
            console.log("Seachrresults, rows:", rows);
            res.json(rows);
        }
    } catch (err) {
        console.log("err in newuser:", err);
        res.json({ err: true });
    }
});

//PART 8 FRIENDBUTTON
const getFriendshipStatus = async (otherUserId, loggedInUserId) => {
    let response = {};
    const { rows } = await db.friendshipStatus(otherUserId, loggedInUserId);
    console.log("rows:", rows);
    if (!rows.length) {
        response = { buttonText: "Add Friend", action: "add" };
    } else if (rows[0].recipient_id == loggedInUserId) {
        response = { buttonText: "Accept", action: "accept" };
    } else if (rows[0].recipient_id == otherUserId) {
        response = { buttonText: "Cancel", action: "cancel" };
    } else {
        response = { buttonText: "End Friendship", action: "end" };
    }
    return response;
};

app.get(`/friendstatus/:id`, async (req, res) => {
    console.log("req.body.params:", req.params);
    const otherUserId = req.params.id;
    const loggedInUserId = req.session.userId;

    try {
        const status = await getFriendshipStatus(otherUserId, loggedInUserId);
        console.log("status:", status);
        res.json(status);
    } catch (err) {
        console.log("err get in friendstatus:", err);
        res.json({ err: true });
    }
});

app.post(`/friendstatus/:id`, async (req, res) => {
    const loggedInUserId = req.session.userId;
    //console.log("req:", req.body);
    const otherUserId = req.params.id;
    const { action } = req.body;
    try {
        if (action === "add") {
            await db.friendRequest(loggedInUserId, otherUserId);
            const status = await getFriendshipStatus(
                otherUserId,
                loggedInUserId
            );
            console.log("status:", status);
            res.json(status);
        } else if (action === "accept") {
            await db.acceptRequest(loggedInUserId, otherUserId);
            const status = await getFriendshipStatus(
                otherUserId,
                loggedInUserId
            );
            console.log("status:", status);
            res.json(status);
        } else {
            await db.cancelRequest(loggedInUserId, otherUserId);
            const status = await getFriendshipStatus(
                otherUserId,
                loggedInUserId
            );
            console.log("status:", status);
            res.json(status);
        }
    } catch (err) {
        console.log("err in post friendstatus:", err);
        res.json({ err: true });
    }
});

// PART 9 FRIENDSLIST

app.get("/api/friendslist", async (req, res) => {
    console.log("api/friendlist get request");
    // datenbankabfrage mit sessionId
    const loggedInUserId = req.session.userId;
    try {
        const data = await db.displayFriends(loggedInUserId);
        // console.log("data in getFriendList:", data);
        res.json(data.rows);
    } catch (err) {
        console.log("err in getFriendsList:", err);
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    console.log("req.session.logout:", req.session);
    res.redirect("/welcome");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        // if the user is not logged in, redirect to /welcome
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

// we changed app to server to set up socket. app got "wrapped" in server
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

//obj that is passed to callback (Socket) represents the network connection
// connection is a eventlistener, so is disconnect
// every connection to the server from every browser has their own socket.id

// PART 10

io.on("connection", async (socket) => {
    //  console.log(socket.request.session);
    const userId = socket.request.session.userId;
    console.log(`socket with id: ${socket.id} has connected`);
    if (!userId) {
        return socket.disconnect(true);
    }
    try {
        const { rows } = await db.listMessages();
        io.emit("listMessages", rows.reverse());
    } catch (err) {
        console.log("err in listMessages:", err);
    }

    socket.on("chatMessage", async (message) => {
        try {
            console.log("message: ", message);

            if (message) {
                const { rows: chatRows } = await db.addMessage(userId, message);
                const { rows } = await db.getUserData(userId);

                const newMessage = {
                    first: rows[0].first,
                    last: rows[0].last,
                    profile_pic_url: rows[0].profile_pic_url,
                    timestamp: chatRows[0].created_at,
                    message: message,
                };
                console.log("newMessage ", newMessage);
                io.emit("chatMessage", newMessage);
            }
        } catch (error) {
            console.log("Err in addMsg: ", error);
        }
    });

    // DANCEFLOOR

    socket.on("color", async (color) => {
        try {
            console.log("color in socket:", color);
            if (color) {
                await db.addColor(userId, color.color);

                //const { rows } = await db.getUserData(userId);
                console.log("rows nach get user:", rows);
                const dancer = {
                    id: rows[0].id,
                    first: rows[0].first,
                    last: rows[0].last,
                    color: color,
                };
                //  console.log("dancer:", dancer);
                io.emit("color", dancer);
            }
        } catch (err) {
            console.log("err in chooseColor:", err);
        }
    });

    socket.on("coordinates", async (coordinates) => {
        // create an array of userObj [{ socketId: ["superlongMumbleJumbleLetters"],
        // userId: 3,color:"#000000",colIndex:18,colIndex:19, onTheDF:true}]
        try {
            let { indexRow, indexCol } = coordinates;
            //console.log("socket:", socket);
            const { rows } = await db.getUserData(userId);
            //console.log("rows nach get user in coordinates:", rows);
            const onDancefloor = {
                socketId: socket.id,
                id: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                color: rows[0].color,
                row: indexRow || null,
                col: indexCol || null,
            };
            console.log("onDancefloor:", onDancefloor);
            io.emit("newDancer", onDancefloor);
        } catch (err) {
            console.log("err in coordinates:", err);
        }
    });
});
