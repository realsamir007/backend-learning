
const userService = require("../service/userService");

async function getUsers(req, res) {
    try {
        const allUsers = await userService.getUsers();

        res.status(200).json({
            success: true,
            message: "All the users are displayed Successfully",
            allUsers
        });

    } catch (error) {
        console.log("Error Message:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }

};

async function getUsersId(req, res) {
    const userId = req.params.id;

    try {
        const currentUser = await userService.getUsersId(userId);

        res.status(200).json({
            success: true,
            message: "Current User",
            currentUser
        });
    } catch (error) {
        console.log("Error Message:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }

};

async function createNewUser(req, res) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Username and Email Required"
            });
        }

        const user = await userService.createUser(
            name,
            email
        );

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user
        });
    } catch (error) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                message: "Email Already Exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "User Creation Failed"
        });
    }
};

async function updateUser(req, res) {
    const userId = req.params.id;
    const { name, email } = req.body;

    try{
        const updatedUser = await userService.updateUser(
            userId,
            name, 
            email
        );
        console.log(updatedUser);
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            updatedUser
        });

    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    } 
};

async function deleteUser(req, res) {
    const userId = req.params.id;

    //const { name, email } = req.body;

    try{
        const delUser = await userService.deleteUser(
            userId,
        );

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
            delUser
        });
    }
    catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUsersId,
    createNewUser,
    updateUser,
    deleteUser
};