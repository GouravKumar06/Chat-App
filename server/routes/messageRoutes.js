const express = require("express");
const { addMessage, getAllMessages } = require("../controller/message");
const router = express.Router();

router.post("/add-messsage",addMessage);
router.post("/get-all-message",getAllMessages)

module.exports = router