const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const {
    getUsers,
    getUsersId,
    createNewUser,
    updateUser,
    deleteUser,  
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authenticate, getUsers)
router.get("/:id", getUsersId);

router.post("/", createNewUser)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)

module.exports = router;