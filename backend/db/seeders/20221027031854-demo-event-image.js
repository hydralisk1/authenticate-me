'use strict';
const { Event } = require('../models')

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
    const eventIds = await Event.findAll({ attributes: ['id'] })
    return queryInterface.bulkInsert('EventImages', [{
      eventId: eventIds[0].id,
      url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      preview: "true",
    }, {
      eventId: eventIds[1].id,
      url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      preview: "false",
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op
     const eventIds = await Event.findAll({ attributes: ['id'] })
     return queryInterface.bulkDelete('EventImages', {
      eventId: {
        [Op.in]: [eventIds[0].id, eventIds[1].id]
      }
     }, {})
  }
};
