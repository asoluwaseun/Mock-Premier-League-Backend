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
      as: 'home_team',
      foreignKey: 'home_team_id'
    })
    teams.hasMany(models.fixtures, {
      as: 'away_team',
      foreignKey: 'away_team_id'
    })
    teams.belongsTo(models.users, {
      foreignKey: 'user_id'
    })
  };
  return teams;
};