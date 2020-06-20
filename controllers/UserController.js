const Models = require('../database/models/');
const { encrypt, decrypt} = require('../helpers/Encryption');
const { sendResponse } = require('../helpers/ResponseHelper');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController{
    static async registerUser(req, res){
        try{
            let {
                firstname,
                lastname,
                phone,
                email,
                password,
                image_path
            } = req.body;

            let [user_details, created] = await Models.users.findOrCreate({
                where: {
                    email: email
                },
                defaults: {
                    firstname,
                    lastname,
                    phone,
                    email,
                    password,
                    role: req.path === '/admin' ? 1 : 0,
                    status: 1,
                    picture: image_path ? `${process.env.GCS_BUCKET_URL}/${image_path}` : null
                }
            });

            if(created){
                user_details.setDataValue('authorization', await jwt.sign({
                    user_id: encrypt(user_details.id),
                    user_type: user_details.role
                }, process.env.JWT_SECRET));
                delete user_details.dataValues.role;

                return sendResponse(res, 200, false,user_details);
            }
            else{
                return sendResponse(res, 203, true, false, "User Already Exists");
            }
        }
        catch(err){
            console.log(err);
            sendResponse(res, 500);
        }
    }

    static async loginUser(req, res){
        try{
            let {
                email,
                password
            } = req.body;

            let user_details = await Models.users.findOne({
                where: {
                    email: email,
                    role: req.path === '/admin/login' ? 1 : 0
                }
            });

            if(user_details){
                const check_pass = await bcrypt.compare(password, user_details.password);
                if(check_pass){
                    user_details.setDataValue('authorization', await jwt.sign({
                        user_id: encrypt(user_details.id),
                        user_type: user_details.role
                    }, process.env.JWT_SECRET));
                    delete user_details.dataValues.role;
                    return sendResponse(res, 200, false,user_details);
                }
                else{
                    return sendResponse(res, 401, true, false, "Invalid User or Password")
                }
            }
            else{
                return sendResponse(res, 401, true, false, "Invalid User or Password")
            }
        }
        catch(err){
            console.log(err)
            sendResponse(res, 500);
        }
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