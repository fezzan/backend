const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('question', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    answer: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'game',
        key: 'id'
      }
    },
    sponsor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sponsor',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'question',
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
        name: "fk_question_game_idx",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "fk_question_sponsor1_idx",
        using: "BTREE",
        fields: [
          { name: "sponsor_id" },
        ]
      },
    ]
  });
};
