'use strict';
module.exports = (sequelize, DataTypes) => {
  const teams_stadia = sequelize.define('teams_stadia', {
    name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    image: DataTypes.TEXT,
    team_id: DataTypes.INTEGER,
    main: DataTypes.INTEGER
  }, {});
  teams_stadia.associate = function(models) {
    teams_stadia.hasMany(models.fixtures, {
      foreignKey: 'stadium_id'
    })
    teams_stadia.belongsTo(models.teams, {
      foreignKey: 'team_id'
    })
  };
  return teams_stadia;
};