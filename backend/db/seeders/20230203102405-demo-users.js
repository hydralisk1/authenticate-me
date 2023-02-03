'use strict';
const bcrypt = require('bcryptjs')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const names = [
  "Galilea-Cisneros",
  "Alden-Holland",
  "Mariah-Ingram",
  "Tripp-Mathews",
  "Sloan-Yates",
  "Braylon-Bradford",
  "Rhea-Villegas",
  "Clyde-Greene",
  "Selena-Sloan",
  "Ocean-Vega",
  "Dakota-Pacheco",
  "Erik-Arias",
  "Aleah-Moon",
  "Nova-Zavala",
  "Liv-Fuentes",
  "Bowen-Salazar",
  "Freya-Leach",
  "Westin-Marquez",
  "Milani-Turner",
  "Joshua-Leblanc",
  "Novalee-Vincent",
  "Aarav-Contreras",
  "Daniela-Khan",
  "Kendrick-Jensen",
  "Jane-Santiago",
  "Beckham-Blackburn",
  "Frida-Rosales",
  "Wilder-Norton",
  "Kylee-Adams",
  "Hudson-Lang",
  "Amirah-Gonzales",
  "Brayden-Logan",
  "Kora-Barrett",
  "Angelo-Yang",
  "Angelina-Romero",
  "Bryson-Hess",
  "Kaliyah-Dorsey",
  "Enoch-Sexton",
  "Ellen-Bryant",
  "Jonah-Blevins",
  "Aila-Buchanan",
  "Enrique-McLaughlin",
  "Stephanie-Brady",
  "Reed-Pineda",
  "Nola-Cook",
  "Ezekiel-Duncan",
  "Elise-Gomez",
  "Isaiah-Enriquez",
  "Nellie-Lucas",
  "Chance-Herring",
  "Denver-Elliott",
  "Blake-Morgan",
  "Delilah-Odom",
  "Kylian-Fleming",
  "Fatima-Marsh",
  "Bo-Robles",
  "Felicity-Humphrey",
  "Krew-Weber",
  "Alayah-Ellis",
  "Cole-Morrison",
  "Rebecca-Strong",
  "Axl-Nichols",
  "Aliyah-Greene",
  "Griffin-Hoover",
  "Virginia-Schmitt",
  "Murphy-Craig",
  "Brynn-Foley",
  "Mohammad-Ventura",
  "Zora-Ray",
  "Arlo-Medina",
  "Elliana-Jarvis",
  "Marlon-Floyd",
  "Yaretzi-Farley",
  "Graysen-Ortiz",
  "Anna-Higgins",
  "Sterling-Lambert",
  "Nina-Huffman",
  "Chris-Pratt",
  "Ailani-Welch",
  "Hendrix-Cannon",
  "Noa-Santiago",
  "Beckham-Molina",
  "Alexandria-Gentry",
  "Magnus-Harrell",
  "Kara-Santiago",
  "Beckham-Cano",
  "Egypt-Bradford",
  "Ander-Farmer",
  "Madelynn-Rich",
  "Miller-Velazquez",
  "Jaliyah-Russell",
  "Weston-McCann",
  "Joyce-Velasquez",
  "Sullivan-Fowler",
  "Lennon-Middleton",
  "Misael-O‚ÄôDonnell",
  "Bellamy-Winters",
  "Deandre-Doyle",
  "Annalise-Randolph",
  "Eugene-Yu"
]

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
    options.tableName = 'Users'

    return queryInterface.bulkInsert(options, names.map(name => {
      const [firstName, lastName] = name.split('-')
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mannam.com`

      return {
        email,
        firstName,
        lastName,
        username: name,
        hashedPassword: bcrypt.hashSync(name)
      }
    }), {});
    },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      username: {[Op.in]: names}
    }, {})
  }
};
