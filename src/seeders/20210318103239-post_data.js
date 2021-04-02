'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('PostTaxonomies', [
       {
         postId: 1,
         categoryId: 1
       },
       {
         postId: 1,
         categoryId: 4
       },
       {
         postId: 1,
         categoryId: 2
       },
       {
         postId: 2,
         categoryId: 2
       },
       {
         postId: 3,
         categoryId: 4
       },
       {
         postId: 3,
         categoryId: 2
       },
       {
         postId: 4,
         categoryId: 1
       },
       {
         postId: 5,
         categoryId: 1
       },
     ], {});
  },

  down: async (queryInterface, Sequelize) => {

     await queryInterface.bulkDelete('PostTaxonomies', null, {});

  }
};
