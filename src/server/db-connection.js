import models from '../database/models';

const dbConnection = () => models.sequelize.authenticate();

export default dbConnection;
