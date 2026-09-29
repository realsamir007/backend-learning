const bcrypt = require('bcrypt');
const crypto = require('crypto');

const pool = require("../../config/database");


async function registerUser(name, email, password) {

    const existingUser = await pool.query(
        `
        SELECT id FROM users
        WHERE email = $1;
        `,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("EMAIL_ALREADY_EXIST");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at;
        `,
        [name, email, passwordHash]
    )

    return result.rows[0];
}

async function loginUser(email, password) {
    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, created_at
        FROM users
        WHERE email = $1;
        `,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const storeSession = await pool.query(
        `
        INSERT INTO sessions (user_id, session_token, expire_at)
        VALUES ($1, $2, $3)
        `,
        [user.id, sessionToken, expiresAt]
    );

    return {
        session: sessionToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
    };
}

async function logoutUser(sessionToken) {
    const result = await pool.query(
        `
        DELETE FROM sessions
        WHERE session_token = $1;
        `,
        [sessionToken]
    );

    if (result.rowCount === 0) {
        throw new Error("INVALID_SESSION");
        };
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};