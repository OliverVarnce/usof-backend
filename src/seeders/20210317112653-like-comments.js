'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('LikesComments', [
         {
            commentId: 1,
            count: 3
         },
         {
             commentId: 2,
             count: 4
         },
         {
             commentId: 3,
             count: 3
         },
         {
             commentId: 4,
             count: 7
         },
         {
             commentId: 4,
             count: 8
         },
         {
             commentId: 5,
             count: 3
         }
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('LikesComments', null, {});
  }
};
