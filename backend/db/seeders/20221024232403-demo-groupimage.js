'use strict';

const { Group } = require('../models')

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
    const groupIds = await Group.findAll({ attributes: ['id'] })

    return queryInterface.bulkInsert('GroupImages', [
    {
      groupId: groupIds[0].id,
      url: 'https://animals.sandiegozoo.org/sites/default/files/2020-08/black-footed.jpg',
      preview: "true"
    },
    {
      groupId: groupIds[1].id,
      url: 'https://media.wired.com/photos/5cdefb92b86e041493d389df/2:1/w_1500,h_750,c_limit/Culture-Grumpy-Cat-487386121.jpg',
      preview: "true"
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op
     const groupIds = await Group.findAll({ attributes: ['id'] })
     return queryInterface.bulkDelete('Groups', {
       groupId: {[Op.in]: [groupIds[0].id, groupIds[1].id]}
     }, {})
  }
};
