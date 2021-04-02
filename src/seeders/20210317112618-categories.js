'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Categories', [
          {
            name: 'PHP',
          },
          {
            name: 'JavaScript',
          },
          {
            name: 'GoLang',
          },
          {
            name: 'Linux',
          },
          {
            name: 'Servers',
          },
          {
            name: 'C++',
          },
          ], {});

  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Categories', null, {});
  }
};
