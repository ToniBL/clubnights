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

module.exports.setCode = (email, code) => {
    const q = `INSERT into reset_codes (email, code) 
    VALUES ($1, $2)`;
    const params = [email, code];
    return db.query(q, params);
};
