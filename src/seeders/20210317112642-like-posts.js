'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('LikesPosts', [
         {
            postId: 1,
            count: 12,
         },
         {
             postId: 2,
             count: 2,
         },
         {
             postId: 3,
             count: 14,
         },
         {
             postId: 4,
             count: 3,
         },
         {
             postId: 5,
             count: 8,
         },
     ], {});

  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('LikesPosts', null, {});
  }
};
