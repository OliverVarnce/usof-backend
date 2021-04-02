'use strict';
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Comments', [
         {
           comment: 'Idont know1',
           postId: 1,
           authorId: 3,
           createdAt: moment.utc().format('2021-03-11 17:02:11'),
           updatedAt: moment.utc().format('2021-02-11 17:02:11')
        },
         {
             comment: 'Idont know2',
             postId: 1,
             authorId: 5,
             createdAt: moment.utc().format('2021-03-11 17:02:11'),
             updatedAt: moment.utc().format('2021-02-11 17:02:11')
         },
         {
             comment: 'Idont know3',
             postId: 3,
             authorId: 2,
             createdAt: moment.utc().format('2021-03-11 17:02:11'),
             updatedAt: moment.utc().format('2021-02-11 17:02:11')
         },
         {
             comment: 'Idont know4',
             postId: 2,
             authorId: 1,
             createdAt: moment.utc().format('2021-03-11 17:02:11'),
             updatedAt: moment.utc().format('2021-02-11 17:02:11')
         },
         {
             comment: 'Idont know5',
             postId: 2,
             authorId: 3,
             createdAt: moment.utc().format('2021-03-11 17:02:11'),
             updatedAt: moment.utc().format('2021-02-11 17:02:11')
         },
         {
             comment: 'Idont know5',
             postId: 1,
             authorId: 2,
             createdAt: moment.utc().format('2021-03-11 17:02:11'),
             updatedAt: moment.utc().format('2021-02-11 17:02:11')
         },
         {
             comment: 'Idont know6',
             postId: 2,
             authorId: 1,
             createdAt: moment.utc().format('2021-03-11 17:02:11'),
             updatedAt: moment.utc().format('2021-02-11 17:02:11')
         },
         {
             comment: 'Idont know7',
             postId: 4,
             authorId: 5,
             createdAt: moment.utc().format('2021-03-11 17:02:11'),
             updatedAt: moment.utc().format('2021-02-11 17:02:11')
         },
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Comments', null, {});
  }
};
