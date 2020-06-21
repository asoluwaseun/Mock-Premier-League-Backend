const Models = require('../database/models/');
const { encrypt } = require('../helpers/Encryption');
const { sendResponse } = require('../helpers/ResponseHelper');
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
                    role: req.path === '/admin' ? process.env.ADMIN_ROLE : process.env.USER_ROLE,
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

                return sendResponse(res, 201, false,user_details);
            }
            else{
                return sendResponse(res, 203, true, false, "User Already Exists");
            }
        }
        catch(err){
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
                    role: req.path === '/admin/login' ? process.env.ADMIN_ROLE : process.env.USER_ROLE,
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
            sendResponse(res, 500);
        }
    }

    static async changePassword(req, res){
        try{
            let {
                old_password,
                new_password
            } = req.body;

            let user = req.body.user;
            let user_details = await Models.users.findOne({
                where: {
                    id: user.user_id
                }
            });

            if(user_details){
                const check_pass = await bcrypt.compare(old_password, user_details.password);
                if(check_pass){
                    await Models.users.update({
                        password: new_password
                    },{
                        where: {
                            id: user.user_id
                        }
                    })
                    return sendResponse(res, 200, false,true, "Password Updated");
                }
                else{
                    return sendResponse(res, 401, true, false, "Invalid Password")
                }
            }
            else{
                return sendResponse(res, 401, true, false, "Invalid User or Password")
            }
        }
        catch (err) {
            sendResponse(res, 500);
        }
    }
}

module.exports = UserController;