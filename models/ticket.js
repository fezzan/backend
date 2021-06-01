const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticket', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tournament',
        key: 'id'
      }
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'ticket',
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
        name: "fk_ticket_tournament1_idx",
        using: "BTREE",
        fields: [
          { name: "tournament_id" },
        ]
      },
      {
        name: "fk_ticket_users1_idx",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
    ]
  });
};
