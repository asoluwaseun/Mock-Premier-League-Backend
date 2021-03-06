"use strict"
const express = require("express");
const router = express.Router();
const UserController = require('../controllers/UserController');
const {
    validate,
    register_user,
    login_user,
    change_password
} = require('../middlewares/Validators');

const FileUpload = require('../middlewares/FileUpload');
const rateLimit = require('express-rate-limit');
const Authentication = require('../middlewares/Authentication');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 4, // 1 requests,
})

router.route('/user')
    .post(
        FileUpload(),
        validate(register_user),
        limiter,
        UserController.registerUser
    );

router.route('/admin')
    .post(
        FileUpload(),
        validate(register_user),
        limiter,
        UserController.registerUser
    );

router.route('/login')
    .post(
        validate(login_user),
        limiter,
        UserController.loginUser
    );

router.route('/admin/login')
    .post(
        validate(login_user),
        limiter,
        UserController.loginUser
    );

router.route('/password')
    .put(
        Authentication,
        validate(change_password),
        limiter,
        UserController.changePassword
    );

module.exports = router
