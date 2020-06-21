"use strict"
const express = require("express");
const router = express.Router();
const TeamsController = require('../controllers/TeamsController');
const {
    validate,
    add_team
} = require('../middlewares/Validators');

const FileUpload = require('../middlewares/FileUpload');
const Authentication = require('../middlewares/Authentication');
const Authorization = require('../middlewares/Authorization');

router.route('/team/:team_id?')
    .post(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        FileUpload(),
        validate(add_team),
        TeamsController.addTeam
    )
    .put(
        Authentication,
        Authorization([process.env.ADMIN_ROLE]),
        FileUpload(),
        validate(add_team),
        TeamsController.updateTeam
    )

module.exports = router
