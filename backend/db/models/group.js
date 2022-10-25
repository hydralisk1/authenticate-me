'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, { as: 'Organizer', foreignKey: 'organizerId' })
      Group.belongsToMany(
        models.User,
        { through: models.Membership, as: 'Members' }
      )
      Group.hasMany(
        models.GroupImage,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true }
      )
      Group.hasMany(
        models.Venue,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true}
      )
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: Sequelize.TEXT,
      validate: {
        isLengthGreaterThanMinLen(value){
          if(value.length < 50) throw new Error('About must be 50 characters or more')
        }
      }
    },
    type: {
      type: Sequelize.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['In person', 'Online']]
      }
    },
    private: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      validate: {
        isIn: [[true, false, 't', 'f', 'true', 'false', 'y', 'n', 'yes', 'no', '1', '0']]
      }
    },
    city: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING(2),
      allowNull: false,
      validate: {
        len: [2, 2]
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
