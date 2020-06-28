/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
import {
  Model,
  UUIDV4,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please, enter a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: user => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      },
      afterCreate: user => {
        user.password = undefined;
      },
    },
  });
  User.prototype.confirmPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.prototype.generateToken = function() {
    return jwt.sign({ userId: this.id }, config.get('auth.secret'), { expiresIn: config.get('auth.expiresIn') });
  };
  return User;
};
