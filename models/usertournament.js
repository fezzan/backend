const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usertournament', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "id_UNIQUE"
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tournament',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'usertournament',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
          { name: "tournament_id" },
        ]
      },
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_usertournament_users1_idx",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
      {
        name: "fk_usertournament_tournament1_idx",
        using: "BTREE",
        fields: [
          { name: "tournament_id" },
        ]
      },
    ]
  });
};
