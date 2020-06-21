const Models = require('../database/models/');
const { encrypt} = require('../helpers/Encryption');
const { sendResponse } = require('../helpers/ResponseHelper');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class TeamsController{
    static async addTeam(req, res){
        try{
            let {
                fullname,
                shortname,
                founder,
                manager,
                nickname,
                website,
                image_path,
                user: {
                    user_id
                }
            } = req.body;


            let [team_details, created] = await Models.teams.findOrCreate({
                where: {
                    fullname: fullname
                },
                defaults: {
                    fullname,
                    shortname,
                    founder,
                    manager,
                    nickname,
                    website,
                    logo: image_path ? `${process.env.GCS_BUCKET_URL}/${image_path}` : null,
                    user_id
                }
            });

            if(created){
                await Models.users_logs.create({
                    user_id,
                    action: `User ${user_id} created team ${team_details.fullname} with id ${team_details.id}`
                })
                return sendResponse(res, 201,false, team_details);
            }
            else{
                return sendResponse(res, 203, true, false, "Team Already Exists");
            }
        }
        catch(err){
            console.log(err)
            sendResponse(res, 500);
        }
    }

    static async updateTeam(req, res){
        try{
            let {
                fullname,
                shortname,
                founder,
                manager,
                nickname,
                website,
                image_path,
                user: {
                    user_id
                }
            } = req.body;
            let { team_id } = req.params;

            let team_details = await Models.teams.findOne({
                where: {
                    id: team_id
                }
            });

            if(team_details){
                let update_payload = {
                    fullname,
                    shortname,
                    founder,
                    manager,
                    nickname,
                    website,
                }

                if(image_path){
                    update_payload.logo = `${process.env.GCS_BUCKET_URL}/${image_path}`;
                }

                let update_team = await Models.teams.update(update_payload, {
                    where :{
                        id: team_id
                    }
                });

                if(update_team){
                    await Models.users_logs.create({
                        user_id,
                        action: `User ${user_id} updated team ${team_details.fullname} with id ${team_details.id}`
                    });
                    sendResponse(res, 200, false, team_details, "Team Updated");
                }
                else{
                    sendResponse(res, 203);
                }

            }
            else{
                sendResponse(res, 203, true, false, "Team not found")
            }
        }
        catch(err){
            sendResponse(res, 500)
        }
    }

    static async deleteTeam(req, res){
        try {

        }
        catch (err) {
            sendResponse(res, 500)
        }
    }

    static async viewTeams(req, res){

    }

    static async viewTeamsFixtures(req, res){

    }

    static async viewTeamsStadia(req, res){

    }

    static async addUserTeam(req, res){

    }

    static async deleteUserTeam(req, res){

    }

    static async getUserTeamFixtures(req, res){

    }
}

module.exports = TeamsController;