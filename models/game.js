const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('game', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gamename: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    round_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'round',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'game',
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
        name: "fk_game_round1_idx",
        using: "BTREE",
        fields: [
          { name: "round_id" },
        ]
      },
    ]
  });
};
