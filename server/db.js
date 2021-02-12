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
