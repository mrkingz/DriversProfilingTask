/* eslint-disable no-tabs */
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  port: process.env.PORT || 8080,
  name: process.env.APP_NAME || 'Drivers Profiling',
  sentryDNS: process.env.SENTRY_DNS,
  auth: {
    expiresIn: 86400,
    secret: process.env.JWT_SECRET,
  },
  /**
	 * API specific configs
	 */
  api: {
    prefix: '^/api/v[1-9]',
    version: 1,
    patch_version: '1.0.0',
    pagination: {
      minItemsPerPage: 10,
      maxItemsPerPage: 100,
    },
  },

  development: {
    logging: false,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: process.env.DEV_DB_DIALECT
  },
};
