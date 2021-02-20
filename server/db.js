const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/network`
);

module.exports.registerUser = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

module.exports.loginUser = (email) => {
    const q = `SELECT * FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.checkEmail = (email) => {
    const q = `SELECT email FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.saveCode = (email, code) => {
    const q = `INSERT into reset_codes (email, code) 
    VALUES ($1, $2)`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.checkCode = (email) => {
    const q = `SELECT code FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'AND email = $1 ORDER BY id DESC`;
    const params = [email];
    return db.query(q, params);
};

module.exports.changePw = (password, email) => {
    const q = `UPDATE users SET password = $1 WHERE email = $2`;
    const params = [password, email];
    return db.query(q, params);
};

module.exports.getUserData = (id) => {
    const q = `SELECT * FROM users WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.imgToDb = (profilePicUrl, id) => {
    console.log(id, profilePicUrl);
    const q = `UPDATE users 
    SET profile_pic_url =$2 
    WHERE id=$1
    RETURNING profile_pic_url`;
    const params = [id, profilePicUrl];
    return db.query(q, params);
};

module.exports.bioToDb = (id, bio) => {
    const q = `UPDATE users SET bio = $2 WHERE id = $1 RETURNING bio`;
    const params = [id, bio];
    return db.query(q, params);
};

module.exports.lastUser = () => {
    const q = `SELECT * FROM users ORDER BY id DESC LIMIT 3`;
    return db.query(q);
};

module.exports.searchUser = (inputVal) => {
    return db.query(
        `SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1 LIMIT 10;`,
        [inputVal + "%"]
    );
};

module.exports.friendshipStatus = (otherUserId, loggedInUserId) => {
    const q = `SELECT * FROM friendships
WHERE (recipient_id = $1 AND sender_id = $2)
OR (recipient_id = $2 AND sender_id = $1);`;
    const params = [otherUserId, loggedInUserId];
    return db.query(q, params);
};

module.exports.friendRequest = (loggedInUserId, otherUserId) => {
    const q = `INSERT into friendships (sender_id, recipient_id) 
    VALUES ($1, $2)`;
    const params = [loggedInUserId, otherUserId];
    return db.query(q, params);
};

module.exports.acceptRequest = (loggedInUserId, otherUserId) => {
    const q = `UPDATE friendships SET accept true WHERE (recipient_id = $1 AND sender_id=$2) 
    OR (recipient_id=$2 AND sender_id =$1)`;
    const params = [loggedInUserId, otherUserId];
    return db.query(q, params);
};

module.exports.cancelRequest = (loggedInUserId, otherUserId) => {
    const q = `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id=$2) 
    OR (recipient_id=$2 AND sender_id =$1)`;
    const params = [loggedInUserId, otherUserId];
    return db.query(q, params);
};
