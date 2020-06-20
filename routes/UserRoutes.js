"use strict"
const express = require("express");
const router = express.Router();
const UserController = require('../controllers/UserController');

router.route('/user')
    .post(UserController.registerUser);

module.exports = router
