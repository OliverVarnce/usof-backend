'use strict';
const { Model } = require('sequelize');
//const passportLocalMongoose = require('passport-local-mongoose');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //User.belongsTo(models.PostTaxonomy, {through: [] });
      User.hasMany(models.Favorites, { foreignKey: 'userId' })
    }
  };



  User.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    login: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false
    },
    confirmCode: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: false
    },
    is_confirm: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expires: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });
  return User;
};
