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
    // associations can be defined here
  };
  return teams_stadia;
};