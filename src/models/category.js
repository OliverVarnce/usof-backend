'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
     static associate(models) {
      //Category.hasMany(models.Post, {foreignKey: 'categoryId'});
      Category.hasMany(models.PostTaxonomy, {foreignKey: 'categoryId'});
    }
  };
  Category.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: false,
  });
  return Category;
};
