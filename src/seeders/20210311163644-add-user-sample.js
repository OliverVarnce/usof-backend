'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('Users', [{
        login: 'John Doe',
        password: '$2a$12$tWiUQrUvQ7gC2jMnF16f4ehJRllJDwqE7kgtCqR6dmcaZBH1E3BhS',
        email: '1@1.ua'
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Users', null, {});
  }
};
