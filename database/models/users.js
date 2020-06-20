'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    picture: DataTypes.TEXT,
    phone: DataTypes.STRING,
    password: DataTypes.TEXT,
    role: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  users.associate = function(models) {
    users.hasMany(models.fixtures, {
      foreignKey: 'user_id'
    })
    users.hasMany(models.teams, {
      foreignKey: 'user_id'
    })
    users.hasMany(models.users_logs, {
      foreignKey: 'user_id'
    })
  };
  return users;
};