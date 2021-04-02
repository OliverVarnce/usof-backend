'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostTaxonomy extends Model {
    static associate(models) {
      PostTaxonomy.belongsTo(models.Post, {foreignKey: 'postId'});
      PostTaxonomy.belongsTo(models.Category, {foreignKey: 'categoryId'});
    }
  };

  PostTaxonomy.init({
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'PostTaxonomy',
  });
  return PostTaxonomy;
};
