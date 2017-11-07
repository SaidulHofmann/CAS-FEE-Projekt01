const express = require('express');
const indexController = require('../controller/userController');

const router = express.Router();

router.post("/login", function(req, res){
    indexController.login(req,res);
});

module.exports = router;