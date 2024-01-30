const express = require('express')
const router = express.Router()
const {getAllContacts, addContact} = require("../Controller/contactController")

router.get("/", getAllContacts);

router.post("/add", addContact);

router.get("/search")

module.exports = router;