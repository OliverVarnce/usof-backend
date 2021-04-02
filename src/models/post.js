'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.hasMany(models.PostTaxonomy, {foreignKey: 'postId'});
      Post.hasMany(models.Favorites, {foreignKey: 'postId'});
      Post.hasMany(models.LikesPost, {foreignKey: 'postId'});
    }
  };

  Post.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    published: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    story: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
