'use strict';
module.exports = (sequelize, DataTypes) => {
  const teams = sequelize.define('teams', {
    fullname: DataTypes.STRING,
    shortname: DataTypes.STRING,
    founder: DataTypes.STRING,
    logo: DataTypes.TEXT,
    nickname: DataTypes.STRING,
    website: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  teams.associate = function(models) {
    // associations can be defined here
  };
  return teams;
};