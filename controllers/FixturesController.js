const Models = require('../database/models/');
const { encrypt} = require('../helpers/Encryption');
const { sendResponse } = require('../helpers/ResponseHelper');
const Pagination = require('../helpers/PaginationHelper');
const moment = require('moment');

const Op = require('sequelize').Op;
const Sequelize = require('sequelize');

class FixturesController{
    static async createFixture(req, res){
        try{
            let {
                home_team_id,
                away_team_id,
                stadium_id,
                match_date,
                user: {
                    user_id
                }
            } = req.body;

            //checks if the team has a fixture at that day already
            let [fixture_details, created] = await Models.fixtures.findOrCreate({
                where: {
                    [Op.or]: [
                        {
                            home_team_id: home_team_id
                        },
                        {
                            home_team_id: away_team_id
                        },
                        {
                            away_team_id: home_team_id
                        },
                        {
                            away_team_id: away_team_id
                        },
                        {
                            stadium_id: stadium_id
                        }
                    ],
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('DATE', Sequelize.col('match_date')), moment(match_date).format('Y-M-D')),
                    ]
                },
                defaults: {
                    home_team_id,
                    away_team_id,
                    stadium_id,
                    user_id,
                    match_date
                }
            })

            if(created){
                await Models.users_logs.create({
                    user_id,
                    action: `User ${user_id} created fixture between ${home_team_id} and ${away_team_id} with id ${fixture_details.id}`
                })
                sendResponse(res, 201,false, true);
            }
            else{
                sendResponse(res,203,true,fixture_details,"One of the Teams Has A Fixture For Set Day")
            }
        }
        catch(err){
            console.log(err)
            sendResponse(res, 500);
        }
    }

    static async updateFixture(req, res){
        try{
            let {
                match_date,
                home_team_goal,
                away_team_goal,
                status,
                user: {
                    user_id
                }
            } = req.body;
            let { fixture_id } = req.params;

            let fixture_details = await Models.fixtures.findOne({
                where: {
                    id: fixture_id ? fixture_id : 0
                }
            })

            if(fixture_details){
                let update_payload = {};

                if(status){
                    update_payload.status = status === 'cancelled' ? -1 : status === 'completed' ? 2 : 0;
                }
                if(home_team_goal){
                    update_payload.home_team_goals = parseInt(fixture_details.home_team_goals) + 1;
                }
                if(away_team_goal){
                    update_payload.away_team_goals = parseInt(fixture_details.away_team_goals) + 1;
                }
                if(match_date){
                    update_payload.match_date = match_date
                }

                if(Object.keys(update_payload).length === 0){
                    return sendResponse(res, 203, true, false, "Nothing to update");
                }

                let [update_fixture] = await Models.fixtures.update(update_payload,{
                    where: {
                        id: fixture_id
                    }
                })

                if(update_fixture){
                    await Models.users_logs.create({
                        user_id,
                        action: `User ${user_id} updated fixture with id ${fixture_details.id}`
                    });
                    sendResponse(res, 200, false, true, "Fixture Updated");
                }
                else{
                    sendResponse(res, 203);
                }
            }
            else{
                sendResponse(res, 203, true, false, "Fixture not found")
            }
        }
        catch(err){
            console.log(err);
            sendResponse(res, 500);
        }
    }

    static async deleteFixture(req, res){
        try {
            let {
                user: {
                    user_id
                }
            } = req.body;

            let { fixture_id } = req.params;

            let fixture_details = await Models.fixtures.findOne({
                where: {
                    id: fixture_id ? fixture_id : 0
                }
            });

            if(fixture_details){
                let delete_fixture = await Models.fixtures.destroy({
                    where: {
                        id: fixture_id
                    }
                });

                if(delete_fixture){
                    await Models.users_logs.create({
                        user_id,
                        action: `User ${user_id} deleted fixture with id ${fixture_details.id}`
                    });
                    sendResponse(res, 204);
                }
                else{
                    sendResponse(res, 203);
                }
            }
            else{
                sendResponse(res, 203, true, false, "Fixture not found")
            }

        }
        catch (err) {
            console.log(err)
            sendResponse(res, 500)
        }
    }

    static async viewFixture(req, res){

    }

    static async viewFixtures(req, res){
        try{

        }
        catch(err){
            sendResponse(res, 500);
        }
    }
}

module.exports = FixturesController;