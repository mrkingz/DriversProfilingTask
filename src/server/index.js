/* eslint-disable no-useless-catch */
import config from 'config';
import express from 'express';
import consola from 'consola';

import appInit from './express-init';
import dbConnection from './db-connection';

(async () => {
  try {
    const app = express();
    await appInit(app);
    await dbConnection(app);

    const PORT = config.get('port');

    app.listen(PORT, () => {
      consola.success(`Server running on PORT ${PORT} in ${app.get('env')} mode`);
    });
  } catch (error) {
    throw error; // Throw the catched error so it can be reported by sentry
  }
})();
