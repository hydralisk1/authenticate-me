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
      url: 'https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&quality=85&auto=format&fit=max&s=a52bbe202f57ac0f5ff7f47166906403',
      preview: "true",
    }, {
      eventId: eventIds[1].id,
      url: 'https://www.purina.co.uk/sites/default/files/2020-12/Understanding%20Your%20Cat%27s%20Body%20LanguageHERO.jpg',
      preview: "true",
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
