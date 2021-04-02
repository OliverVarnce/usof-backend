'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikesPost extends Model {
    static associate(models) {
     LikesPost.belongsTo(models.Post);
     LikesPost.belongsTo(models.LikesComment)
    }
  };

  LikesPost.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    postId: {
      type: DataTypes.INTEGER
    },
    count: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'LikesPost',
  });
  return LikesPost;
};