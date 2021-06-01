const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('prizeConfig', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    prize: {
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
    xp: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'prizeConfig',
    timestamps: false,
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
        name: "fk_prizeConfig_tournament1_idx",
        using: "BTREE",
        fields: [
          { name: "tournament_id" },
        ]
      },
    ]
  });
};
