const express = require("express");
const { register, login, setAvatar, getAllUsers } = require("../controller/user");
const router = express.Router();

router.post("/register",register)
router.post("/login",login);
router.post("/set-avatar/:id",setAvatar);
router.get("/all-users/:id",getAllUsers)

module.exports = router;