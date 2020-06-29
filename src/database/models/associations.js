import {
  Model,
  UUIDV4,
} from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Association extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Association.hasMany(models.Membership, {
        // as: 'members',
        foreignKey: {
          name: 'associationId',
          allowNull: false,
        },
      });
      Association.belongsToMany(models.User, {
        through: models.Membership,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        as: 'members',
        foreignKey: {
          name: 'associationId',
          allowNull: false
        },
        otherKey: {
          name: 'userId',
          allowNull: false,
        }
      });
    }
  }
  Association.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Association',
  });
  return Association;
};
