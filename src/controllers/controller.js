import * as Sentry from '@sentry/node';
import consola from 'consola';

/* eslint-disable class-methods-use-this */
export default class Controller {
  constructor(model) {
    this.model = model;
    this.fillables = [];
    this.create = this.create.bind(this);
  }

  create(req, res) {
    return this.tryCatchHandler(res, async () => {
      const fillables = this.getFillables().length > 0
        ? { fields: this.getFillables() }
        : {};

      const data = await this.model.create(req.body, fillables);
      return {
        status: this.getStatus().CREATED,
        message: `${this.model.name} successfully created`,
        data,
      };
    });
  }

  getFillables() {
    return this.fillables;
  }

  /**
   * Try-catch handler for all Http request
   *
   * @param {Response} res the Http response object
   * @param {Function} callback an express function that handles the request
   * @returns Http response
   * @memberof Controller
   */
  async tryCatchHandler(res, callback) {
    try {
      const response = await callback();
      return (typeof response === 'function')
        ? response()
        : this.successResponse(res, response);
    } catch (error) {
      return this.errorResponse(res, error);
    }
  }

  getStatus() {
    return {
      OK: 200,
      CREATED: 201,
      NOT_FOUND: 404,
      BAD_REQUEST: 400,
      CONFLICT: 409,
      SERVER_ERROR: 500,
    };
  }

  /**
   * Handles success response
   *
   * @param {Response} res
   * @param {Object} response the response data
   * @memberof Controller
   */
  successResponse(res, response) {
    const {
      status, success, message, data,
    } = response;
    const { OK, BAD_REQUEST } = this.getStatus();

    const code = status || OK;
    res.status(code)
      .json({
        success: success || (code >= OK && code < BAD_REQUEST),
        message,
        data,
      });
  }

  /**
   * Handle request error
   *
   * @param {Response} res Http response object
   * @param {Error} error the error object thrown
   * @memberof Controller
   */
  errorResponse(res, error) {
    let { status, message } = error;
    if (res.app.settings.env === 'development') {
      consola.error(error);
    }

    if (!status) {
      status = this.getStatus().SERVER_ERROR;
      message = 'Internal error ocurred, try again';
      Sentry.captureException(error);
    }

    res.status(status)
      .json({
        success: false,
        error: message || error.errors,
      });
  }
}
