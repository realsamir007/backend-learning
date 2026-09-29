const pool = require("../../config/database")

async function authenticate(req, res, next) {
    try {
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            return res.status(401).json({
                message: "Session Token is required",
            });
        };

        const authCheck = await pool.query(
            `
        SELECT *
        FROM sessions
        WHERE session_token = $1
        AND expire_at > NOW();
        `,
            [sessionToken]
        );

        if (authCheck.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid or expired session"
            });
        }

        req.user = {
            id: authCheck.rows[0].user_id
        };

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Invalid or expired token",
        });
    };
}

module.exports = authenticate;