'use strict';
const { Group, Venue } = require('../models')

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
   const venueIds = await Venue.findAll({ attributes: ['id'] })
   const groupIds = await Group.findAll({ attributes: ['id'] })

   return queryInterface.bulkInsert('Events', [{
    venueId: venueIds[0].id,
    groupId: groupIds[0].id,
    name: "Demo Event",
    description: "adlvkfjhadslkfjvdslkvfjdslkvfjdklsvjfsklvjflkdsvj",
    type: "Online",
    capacity: 10,
    price: 18.50,
    startDate: "2022-11-10 12:00:00",
    endDate: "2022-11-10 15:00:00"
   },{
    venueId: venueIds[1].id,
    groupId: groupIds[1].id,
    name: "Demo Event2",
    description: "lkjkjevlkwjevlkejvlkewjvklwevr",
    type: "In person",
    capacity: 20,
    price: 800.78,
    startDate: "2023-07-10 12:00:00",
    endDate: "2023-08-10 15:00:00"
   },{
    venueId: venueIds[2].id,
    groupId: groupIds[2].id,
    name: "Demo Event3",
    description: "lkjkdslkvfhdslkvhfdskjvhjevlkwjevlkejvlkewjvklwevr",
    type: "In person",
    capacity: 50,
    price: 7.78,
    startDate: "2023-08-10 12:00:00",
    endDate: "2023-09-10 15:00:00"
   }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const venueIds = await Venue.findAll({ attributes: ['id'] })
     const groupIds = await Group.findAll({ attributes: ['id'] })
     const Op = Sequelize.Op

     return queryInterface.bulkDelete('Events', {
      [Op.or]: [
        { groupId: { [Op.in]: [groupIds[0].id, groupIds[1].id, groupIds[2].id] }},
        { venueId: { [Op.in]: [venueIds[0].id, venueIds[1].id, venueIds[2].id] }}
      ]
     }, {})
  }
};
