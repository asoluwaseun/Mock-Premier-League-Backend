const Models = require('../database/models/');
const { sendResponse } = require('../helpers/ResponseHelper');
const Pagination = require('../helpers/PaginationHelper');

const Op = require('sequelize').Op;

class TeamsController{
    static async createTeam(req, res){
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

                let [update_team] = await Models.teams.update(update_payload, {
                    where :{
                        id: team_id ? team_id : 0
                    }
                });

                if(update_team){
                    await Models.users_logs.create({
                        user_id,
                        action: `User ${user_id} updated team ${team_details.fullname} with id ${team_details.id}`
                    });
                    sendResponse(res, 200, false, true, "Team Updated");
                }
                else{
                    sendResponse(res, 203);
                }

            }
            else{
                sendResponse(res, 203, true, false, "Team not found");
            }
        }
        catch(err){
            sendResponse(res, 500)
        }
    }

    static async deleteTeam(req, res){
        try {
            let {
                user: {
                    user_id
                }
            } = req.body;

            let { team_id } = req.params;

            let team_details = await Models.teams.findOne({
                where: {
                    id: team_id ? team_id : 0
                }
            });

            if(team_details){
                await Promise.all([
                    Models.teams.destroy({
                        where: {
                            id: team_id
                        }
                    }),
                    Models.fixtures.destroy({
                        where: {
                            home_team_id: team_id
                        }
                    }),
                    Models.fixtures.destroy({
                        where: {
                            away_team_id: team_id
                        }
                    }),
                    Models.users_logs.create({
                        user_id,
                        action: `User ${user_id} deleted team ${team_details.fullname} with id ${team_details.id}`
                    })
                ])

                sendResponse(res, 204);
            }
            else{
                sendResponse(res, 203, true, false, "Team not found")
            }

        }
        catch (err) {
            sendResponse(res, 500)
        }
    }

    static async viewTeam(req, res){
        try{
            let { team_id } = req.params;

            let team_details = await Models.teams.findOne({
                where:{
                    id: team_id ? team_id : 0
                },
                include: [
                    {
                        as: "home_fixtures",
                        model: Models.fixtures,
                        include: [
                            {
                                as: "away_team",
                                model: Models.teams
                            }
                        ]
                    },
                    {
                        as: "away_fixtures",
                        model: Models.fixtures,
                        include: [
                            {
                                as: "home_team",
                                model: Models.teams
                            }
                        ]
                    },
                    Models.teams_stadia
                ]
            });

            if(team_details){
                sendResponse(res, 200, false, team_details);
            }
            else{
                sendResponse(res, 404);
            }
        }
        catch (err) {
            console.log(err)
            sendResponse(res, 500);
        }
    }

    static async viewTeams(req, res){
        try{

            let {page: page_id, order, search} = req.query;
            let options = {};
            let _order = [];

            if(search){
                options[Op.or] = [
                    {
                        fullname: {
                            [Op.like] : `%${search}%`
                        }
                    },
                    {
                        shortname: {
                            [Op.like] : `%${search}%`
                        }
                    },
                    {
                        nickname: {
                            [Op.like] : `%${search}%`
                        }
                    },
                    {
                        manager: {
                            [Op.like] : `%${search}%`
                        }
                    },
                    {
                        founder: {
                            [Op.like] : `%${search}%`
                        }
                    }
                ]
            }

            if(order){
                if(order === "name-asc"){
                    _order = [
                        ['fullname', 'ASC']
                    ]
                }
                if(order === "name-desc"){
                    _order = [
                        ['fullname', 'DESC']
                    ]
                }
            }

            let {count: all_teams} = await Models.teams.findAndCountAll({
                where: options
            });

            let currentPage = page_id > 0 ? page_id : 1;
            let perPage = 12;


            let Paginate = new Pagination(all_teams,currentPage,perPage);

            let teams = await Models.teams.findAll({
                where: options,
                include: [
                    {
                        as: "home_fixtures",
                        model: Models.fixtures,
                        include: [
                            {
                                as: "away_team",
                                model: Models.teams
                            }
                        ]
                    },
                    {
                        as: "away_fixtures",
                        model: Models.fixtures,
                        include: [
                            {
                                as: "home_team",
                                model: Models.teams
                            }
                        ]
                    },
                    Models.teams_stadia
                ],
                order: _order,
                limit: Paginate.perPage,
                offset: Paginate.offset
            })

            let data = {
                total_teams: all_teams,
                per_page: Paginate.perPage,
                current_page: Paginate.pageCount > Paginate.offset ? Paginate.pageCount : 1,
                total_pages: Paginate.pageCount,
                teams: teams
            }

            sendResponse(res, 200, false, data)

        }
        catch (err) {
            console.log(err)
            sendResponse(res, 500);
        }
    }

    static async createTeamStadium(req, res){
        try{
            let {
                name,
                nickname,
                team_id,
                image_path,
                user: {
                    user_id
                }
            } = req.body;

            let [stadium_details, created] = await Models.teams_stadia.findOrCreate({
                where: {
                    name: name,
                    team_id: team_id
                },
                defaults: {
                    name,
                    nickname,
                    image: image_path ? `${process.env.GCS_BUCKET_URL}/${image_path}` : null,
                    team_id,
                    main: 1
                }
            });

            if(created){
                await Models.users_logs.create({
                    user_id,
                    action: `User ${user_id} created stadium ${stadium_details.name} for team ${stadium_details.team_id} with id ${stadium_details.id}`
                })
                sendResponse(res, 201, false, stadium_details);
            }
            else{
                sendResponse(res, 203, true, false, "Stadium Already Exists for Team");
            }

        }
        catch(err){
            console.log(err)
            sendResponse(res, 500);
        }
    }

    static async deleteTeamStadium(req, res){
        try{
            let { stadium_id } = req.params;
            let {
                user: {
                    user_id
                }
            } = req.body;

            let stadium_details = await Models.teams_stadia.findOne({
                where: {
                    id: stadium_id ? stadium_id : 0
                }
            });

            if(stadium_details){
                await Promise.all([
                    Models.teams_stadia.destroy({
                        where: {
                            id: stadium_id
                        }
                    }),
                    Models.users_logs.create({
                        user_id,
                        action: `User ${user_id} deleted stadium ${stadium_details.name} with id ${stadium_details.id}`
                    })
                ])
                sendResponse(res, 204);
            }
            else{
                sendResponse(res, 404);
            }
        }
        catch(err){
            sendResponse(res, 500);
        }
    }

    static async viewTeamsStadia(req, res){
        try{
            let teams_stadia = await Models.teams_stadia.findAll({
                include: [Models.teams]
            });
            sendResponse(res, 200, false, teams_stadia);
        }
        catch(err){
            sendResponse(res, 500);
        }
    }
}

module.exports = TeamsController;