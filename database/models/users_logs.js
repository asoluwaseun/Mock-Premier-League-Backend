'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_logs = sequelize.define('users_logs', {
    user_id: DataTypes.INTEGER,
    action: DataTypes.TEXT
  }, {});
  users_logs.associate = function(models) {
    users_logs.belongsTo(models.users, {
      foreignKey: 'user_id'
    })
  };
  return users_logs;
};