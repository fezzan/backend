const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type_typekey: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'type',
        key: 'typekey'
      }
    }
  }, {
    sequelize,
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_transaction_users1_idx",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
      {
        name: "fk_transactions_type1_idx",
        using: "BTREE",
        fields: [
          { name: "type_typekey" },
        ]
      },
    ]
  });
};
