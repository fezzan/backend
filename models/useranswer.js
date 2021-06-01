const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('useranswer', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "id_UNIQUE"
    },
    answer: {
      type: DataTypes.TINYINT,
      allowNull: true
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
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'question',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'useranswer',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
          { name: "question_id" },
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
        name: "fk_useranswer_users1_idx",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
      {
        name: "fk_useranswer_question1_idx",
        using: "BTREE",
        fields: [
          { name: "question_id" },
        ]
      },
    ]
  });
};
