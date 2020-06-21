"use strict"
const express = require("express");
const router = express.Router();
const FixturesController = require('../controllers/FixturesController');
const {
    validate,
    add_fixture,
    edit_fixture
} = require('../middlewares/Validators');

const Authentication = require('../middlewares/Authentication');
const Authorization = require('../middlewares/Authorization');

router.get('/fixtures',FixturesController.viewFixtures);
router.get('/fixture/team/:team_id',FixturesController.viewTeamFixtures);

router.route('/fixture/:fixture_id?')
    .get(
        FixturesController.viewFixture
    )
    .post(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        validate(add_fixture),
        FixturesController.createFixture
    )
    .put(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        validate(edit_fixture),
        FixturesController.updateFixture
    )
    .delete(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        FixturesController.deleteFixture
    )

module.exports = router
