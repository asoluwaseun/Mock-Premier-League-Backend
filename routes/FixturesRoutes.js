"use strict"
const express = require("express");
const router = express.Router();
const FixturesController = require('../controllers/FixturesController');
const {
    validate,
    add_fixture
} = require('../middlewares/Validators');

const Authentication = require('../middlewares/Authentication');
const Authorization = require('../middlewares/Authorization');

router.route('/fixture/:fixture_id?')
    .post(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        validate(add_fixture),
        FixturesController.createFixture
    )
    .delete(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        FixturesController.deleteFixture
    )

module.exports = router
