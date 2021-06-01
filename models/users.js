const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    charity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'charity',
        key: 'id'
      }
    },
    invitedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "fk_users_charity1_idx",
        using: "BTREE",
        fields: [
          { name: "charity_id" },
        ]
      },
      {
        name: "fk_users_users1_idx",
        using: "BTREE",
        fields: [
          { name: "invitedBy" },
        ]
      },
    ]
  });
};
