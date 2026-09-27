const express = require("express");

const {
    getUsers,
    getUsersId,
    createNewUser,
    updateUser,
    deleteUser,  
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers)
router.get("/:id", getUsersId);

router.post("/", createNewUser)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)

module.exports = router;