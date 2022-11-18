'use strict';

const { User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = [
    {
      name: 'Hi guys',
      about: 'asdkvjfsalkdvjflskavjflkjsdkvfljdsavlkjfsdv',
      type: 'In person',
      private: true,
      city: 'New York',
      state: 'NY',
    },
    {
      name: 'Tennis Club',
      about: 'asdkvjfsalasdvfsvdkdvjflskavjflkjsdkvfljdsavlkjfsdv',
      type: 'Online',
      private: false,
      city: 'Phoenix',
      state: 'AZ',
    },
    {
      name: 'WoW Club',
      about: 'For the Alliance',
      type: 'Online',
      private: false,
      city: 'Scottsdale',
      state: 'AZ',
    }]

    const userIds = await User.findAll({ attributes: ['id'] })
    userIds.forEach((userId, i) => data[i].organizerId = userId.id)

    return queryInterface.bulkInsert('Groups', data, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op
     return queryInterface.bulkDelete('Groups', {
       name: {[Op.in]: ['Hi guys', 'Tennis Club', 'WoW Club']}
     }, {})
  }
};
