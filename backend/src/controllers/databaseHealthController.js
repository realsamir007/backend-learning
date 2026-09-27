const pool = require("../../config/database");

async function databaseHealth(req, res){
    try {
        const result = await pool.query(
            'SELECT NOW();'
        );

        res.json({
            status: "connected",
            database: result.rows[0],
            dbTime: result.rows[0].now,
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed",
        });
    }
};

module.exports = { databaseHealth };