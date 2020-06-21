'use strict';
module.exports = (sequelize, DataTypes) => {
  const fixtures = sequelize.define('fixtures', {
    home_team_id: DataTypes.INTEGER,
    away_team_id: DataTypes.INTEGER,
    home_team_goals: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    away_team_goals: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    stadium_id: DataTypes.INTEGER,
    match_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  fixtures.associate = function(models) {
    fixtures.belongsTo(models.teams, {
      as: "home_team",
      foreignKey: "home_team_id"
    })
    fixtures.belongsTo(models.teams, {
      as: "away_team",
      foreignKey: "away_team_id"
    })
    fixtures.belongsTo(models.teams_stadia, {
      foreignKey: "stadium_id"
    })
    fixtures.belongsTo(models.users, {
      foreignKey: "user_id"
    })
  };
  return fixtures;
};