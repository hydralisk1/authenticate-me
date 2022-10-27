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
      url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      preview: "true"
    },
    {
      groupId: groupIds[1].id,
      url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      preview: "false"
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
