'use strict';
const hash = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    picture: DataTypes.TEXT,
    phone: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      set(val) {
        const _password = hash.hashSync(val, 8);
        this.setDataValue('password', _password);
      }
    },
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

  users.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };
  return users;
};