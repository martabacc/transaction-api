'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    date: DataTypes.DATE,
    amount: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User, { as: 'User', foreignKey: 'user_id', targetKey: 'id' });
  };
  return Transaction;
};
