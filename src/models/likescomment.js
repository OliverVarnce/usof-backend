'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likesComment extends Model {
    static associate(models) {
      likesComment.hasOne
    }
  };

  likesComment.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'LikesComment',
  });
  return likesComment;
};