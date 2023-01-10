'use strict';
const { Event, User } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
   options.tableName = 'Attendances'
   const eventIds = await Event.findAll({ attributes: ['id'] })
   const userIds = await User.findAll({ attributes: ['id'] })

   return queryInterface.bulkInsert(options, [{
    eventId: eventIds[0].id,
    userId: userIds[0].id,
    status: 'waitlist',
   },{
    eventId: eventIds[1].id,
    userId: userIds[1].id,
    status: 'pending',
   },{
    eventId: eventIds[2].id,
    userId: userIds[0].id,
    status: 'member',
   }, {
    eventId: eventIds[1].id,
    userId: userIds[0].id,
    status: 'waitlist',
   }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const eventIds = await Event.findAll({ attributes: ['id'] })
    const Op = Sequelize.Op
    options.tableName = 'Attendances'
    return queryInterface.bulkDelete(options, {
      eventId: {
        [Op.in]: [eventIds[0].id, eventIds[1].id, eventIds[2].id]
      }
    })
  }
};
