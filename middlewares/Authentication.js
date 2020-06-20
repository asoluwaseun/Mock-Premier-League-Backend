const jwt = require('jsonwebtoken');
const { sendResponse } = require('../helpers/ResponseHelper');
const { decrypt } = require('../helpers/Encryption');
require('dotenv');

module.exports = (req, res, next) => {
    try {
        let token = req.headers['Authorization'] &&  req.headers['Authorization'].split(" ").length === 2 ? req.headers['Authorization'].split(" ")[1] : null;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (!err) {
                    let user = decoded;
                    if (user && user.user_id && user.user_type) {
                        user.user_id = decrypt(user.user_id);
                        req.body['user'] = user;
                        next();
                    } else {
                        sendResponse(res, 401);
                    }
                } else {
                    sendResponse(res, 401);
                }
            });
        } else {
            sendResponse(res,401);
        }
    } catch (e) {
        sendResponse(res, 500);
    }
};