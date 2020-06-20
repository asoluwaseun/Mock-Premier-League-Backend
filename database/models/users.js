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
    // associations can be defined here
  };
  return users;
};