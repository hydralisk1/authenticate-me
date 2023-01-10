'use strict';
const { User, Group } = require('../models')

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
    const userIds = await User.findAll({ attributes: ['id'] })
    const groupIds = await Group.findAll({ attributes: ['id'] })

    options.tableName = 'Memberships'


    return queryInterface.bulkInsert(options, [
    {
      userId: userIds[1].id,
      groupId: groupIds[0].id,
      status: 'pending'
    },
    {
      userId: userIds[2].id,
      groupId: groupIds[1].id,
      status: 'member'
    },
    {
      userId: userIds[0].id,
      groupId: groupIds[1].id,
      status: 'co-host'
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
     const userIds = await User.findAll({ attributes: ['id'] })

     options.tableName = 'Memberships'

     return queryInterface.bulkDelete(options, {
      userId: {[Op.in]: userIds.map(userId => userId.id)}
     }, {})
  }
};
