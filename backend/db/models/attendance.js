'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Events',
      },
      allowNull: false,
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users'
      },
      allowNull: false,
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['member', 'waitlist', 'pending', 'attending']]
      }
    },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
