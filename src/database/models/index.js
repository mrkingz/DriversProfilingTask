import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from 'config';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config.get(`database.${env}`);

const db = {};

let sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

fs

  .readdirSync(__dirname)

  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))

  .forEach((file) => {
    const model = import(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

db.Sequelize = Sequelize;

module.exports = db;
