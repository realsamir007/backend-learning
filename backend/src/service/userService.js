const pool = require("../../config/database");

async function getUsers() {
    const result = await pool.query("SELECT * FROM users;")
    return result.rows;
}

async function getUsersId(userId) {
    const result = await pool.query(
        `
        SELECT * FROM users 
        WHERE id = $1;
        `,
        [userId]
    );

    // 1. Check if a user was actually found
    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // 2. Return the found user
    return result.rows[0];

}

async function createUser(name, email) {
    const existingUser = await pool.query(
        " SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const result = await pool.query(
        `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING id, name, email;
        `,
        [name, email]
    );

    return result.rows[0]
}

async function updateUser(userId, name, email) {

    const result = await pool.query(
        `
        UPDATE users
        SET name = $1, email = $2
        WHERE id = $3
        RETURNING *;
        `,
        [name, email, userId]
    );

    if (result.rows.length === 0) {
        throw new Error("USER_NOT_FOUND");
    };
    
    return result.rows[0];
    
}

async function deleteUser(userId) {
    const result = await pool.query(
        `
        DELETE FROM users
        WHERE id = $1
        RETURNING *;
        `,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("USER_NOT_FOUND");
    };

    return result.rows[0];
}

module.exports = {
    getUsers,
    getUsersId,
    createUser, 
    updateUser,
    deleteUser
}