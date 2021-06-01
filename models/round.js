const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('round', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roundnumber: {
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
    criteria: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    setActive: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'round',
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
        name: "fk_round_tournament1_idx",
        using: "BTREE",
        fields: [
          { name: "tournament_id" },
        ]
      },
    ]
  });
};
