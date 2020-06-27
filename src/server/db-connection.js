import models from '../database/models';

const dbConnection = async app => {
  await models.sequelize.authenticate();
  await models.sequelize.sync({ force: app.get('env') !== 'production' });
};

export default dbConnection;
