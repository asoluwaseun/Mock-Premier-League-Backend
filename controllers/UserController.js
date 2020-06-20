const Models = require('../database/models/');
const { encrypt, decrypt} = require('../helpers/Encryption');
const { sendResponse } = require('../helpers/ResponseHelper');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController{
    static async registerUser(req, res){
        res.send('hi')
    }

    static async registerAdmin(req, res){

    }

    static async loginUser(req, res){

    }

    static async loginAdmin(req, res){

    }

    static async changePassword(req, res){

    }

    static async addUserTeam(req, res){

    }

    static async deleteUserTeam(req, res){

    }

    static async getUserTeamFixtures(req, res){

    }
}

module.exports = UserController;