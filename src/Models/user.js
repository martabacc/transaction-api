'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Transaction, { as: 'Transactions', foreignKey: 'user_id', sourceKey: 'id' });
  };
  return User;
};
