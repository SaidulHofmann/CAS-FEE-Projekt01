const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post("/login", function (req, res) {
    userController.login(req, res);
});

module.exports = router;