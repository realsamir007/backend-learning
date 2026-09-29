const authService = require("../service/authService");

async function register(req, res) {

    try {
        const { name, password } = req.body;

        // Storing the email values in let because the user input email is transformed into lowercasing
        let { email } = req.body;
        // Creating format for password and email using Regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Checking if the user entered all three necessary filed 
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Provide Email, Name, and Password"
            });
        }
        // Converting email entered bu user to remove any space and lowercasing
        email = email.trim().toLowerCase();
        // Checking if the email format is valid
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // Checking if the password format is valid
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Password does not meet requirements.",
                details: [
                    "Minimum 8 characters long",
                    "At least 1 uppercase letter",
                    "At least 1 lowercase letter",
                    "At least 1 number",
                    "At least 1 special character (@$!%*?&)"
                ]
            });
        }

        const user = await authService.registerUser(
            name,
            email,
            password
        );

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user
        });

    } catch (error) {
        console.error("Registration Error:", error);

        if (error.message === "EMAIL_ALREADY_EXIST") {
            return res.status(409).json({
                success: false,
                message: "Email Already Registered"
            });
        }

        res.status(500).json({
            success: false,
            message: "Registration Failed"
        });
    }
}

async function login(req, res) {
    try {
        const { password } = req.body;
        let { email } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        };

        email = email.trim().toLowerCase();

        const result = await authService.loginUser(
            email,
            password
        );

        res.cookie("session_token", result.session, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login Successful",
            ...result,
        });



    } catch (error) {
        console.error("Login error:", error);

        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        res.status(500).json({
            message: "Login failed",
        });
    }

}

async function logout(req, res) {
    try {
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            return res.status(401).json({
                message: "Session Token is required",
            });
        };

        const result = await authService.logoutUser(
            sessionToken
        );

        res.clearCookie("session_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: "Logged Out SuccessFully"
        })

    } catch (error) {
        if (error.message === "INVALID_SESSION") {
            return res.status(401).json({
                message: "Invalid or expired session"
            });
        }
    };
}

module.exports = {
    register,
    login,
    logout
};