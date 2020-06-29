import {
  Model,
  UUIDV4,
} from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        }
      });
      Membership.belongsTo(models.Association, {
        as: 'members',
        foreignKey: {
          name: 'associationId',
          allowNull: false,
        }
      });
    }
  }
  Membership.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    associationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Membership',
    timestamps: false,
  });
  return Membership;
};
