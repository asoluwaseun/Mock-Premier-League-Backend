"use strict"
const express = require("express");
const router = express.Router();
const TeamsController = require('../controllers/TeamsController');
const {
    validate,
    add_team,
    add_stadium
} = require('../middlewares/Validators');

const FileUpload = require('../middlewares/FileUpload');
const Authentication = require('../middlewares/Authentication');
const Authorization = require('../middlewares/Authorization');

router.route('/team/:team_id?')
    .get(
        TeamsController.viewTeam
    )
    .post(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        FileUpload(),
        validate(add_team),
        TeamsController.createTeam
    )
    .put(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        FileUpload(),
        validate(add_team),
        TeamsController.updateTeam
    )
    .delete(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        TeamsController.deleteTeam
    )

router.get('/teams', TeamsController.viewTeams);

router.route('/teams/stadia/:stadium_id?')
    .get(TeamsController.viewTeamsStadia)
    .post(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        FileUpload(),
        validate(add_stadium),
        TeamsController.createTeamStadium
    )
    .delete(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        TeamsController.deleteTeamStadium
    )

module.exports = router
