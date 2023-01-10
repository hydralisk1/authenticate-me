'use strict';

const { Group } = require('../models')

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
   const groupIds = await Group.findAll({ attributes: ['id'] })
   const data = [{
    groupId: groupIds[0].id,
    address: '1 William Street',
    city: 'Englewood',
    state: 'NJ',
    lat: 40.704869,
    lng: -74.009975
   },{
    groupId: groupIds[1].id,
    address: '2417 Camner Street',
    city: 'Fort Lee',
    state: 'NJ',
    lat: 42.124868,
    lng: -70.001545
   },{
    groupId: groupIds[2].id,
    address: '15446 N Greenway Hayden Loop',
    city: 'Scottsdale',
    state: 'AZ',
    lat: 33.62665,
    lng: -111.92233
   },{
    groupId: groupIds[0].id,
    address: '15444 N Dial Blvd',
    city: 'Scottsdale',
    state: 'AZ',
    lat: 32.62665,
    lng: -110.92233
   }]

   options.tableName = 'Venues'

   return queryInterface.bulkInsert(options, data, {})
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

    options.tableName = 'Venues'

    return queryInterface.bulkDelete(options, {
      groupId: {[Op.in]: [groupIds[0].id, groupIds[1].id, groupIds[2].id]}
    }, {})
  }
};
