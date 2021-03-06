'use strict';
module.exports = (sequelize, DataTypes) => {
  const teams = sequelize.define('teams', {
    fullname: DataTypes.STRING,
    shortname: DataTypes.STRING,
    founder: DataTypes.STRING,
    manager: DataTypes.STRING,
    logo: DataTypes.TEXT,
    nickname: DataTypes.STRING,
    website: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  teams.associate = function(models) {
    teams.hasMany(models.fixtures, {
      as: 'home_fixtures',
      foreignKey: 'home_team_id'
    })
    teams.hasMany(models.fixtures, {
      as: 'away_fixtures',
      foreignKey: 'away_team_id'
    })
    teams.belongsTo(models.users, {
      foreignKey: 'user_id'
    })
    teams.hasMany(models.teams_stadia, {
      foreignKey: 'team_id'
    })
  };
  return teams;
};