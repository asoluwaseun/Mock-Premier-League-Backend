'use strict';
module.exports = (sequelize, DataTypes) => {
  const fixtures = sequelize.define('fixtures', {
    home_team_id: DataTypes.INTEGER,
    away_team_id: DataTypes.INTEGER,
    home_team_goals: DataTypes.INTEGER,
    away_team_goals: DataTypes.INTEGER,
    stadium_id: DataTypes.INTEGER,
    match_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  fixtures.associate = function(models) {
    // associations can be defined here
  };
  return fixtures;
};