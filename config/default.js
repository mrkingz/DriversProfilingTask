/* eslint-disable no-tabs */
import dotenv from 'dotenv';

dotenv.config();
module.exports = {
  port: process.env.PORT || 8080,
  name: process.env.APP_NAME,
  sentryDNS: process.env.SENTRY_DNS,
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
};
