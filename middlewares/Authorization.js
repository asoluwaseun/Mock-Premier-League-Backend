"use strict";
const { sendResponse } = require("../helpers/ResponseHelper");

//checks if user type is permitted on route
module.exports = (values = [])=>{
    return async (req, res, next)=>{
        try{
            let user_type = req.body.user["user_type"];

            let index = values.findIndex((u)=>{
                return u === user_type;
            })

            if(index > -1){
                next()
            }
            else{
                return sendResponse(res, 401);
            }
        }
        catch(err){
            return sendResponse(res, 500);
        }
    }
}