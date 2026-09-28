const bcrypt = require('bcrypt');
const pool = require("../../config/database");


async function registerUser(name, email, password) {

    const existingUser = await pool.query(
        `
        SELECT id FROM users
        WHERE email = $1;
        `,
        [email]
    );

    if (existingUser.rows.length > 0){
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

    if (result.rows.length === 0){
        throw new Error("INVALID_CREDENTIALS");
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );
    
    if (!passwordMatch){
        throw new Error("INVALID_CREDENTIALS");
    }

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
    };  
}

module.exports = {
    registerUser,
    loginUser
};