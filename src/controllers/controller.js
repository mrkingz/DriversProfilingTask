import * as Sentry from '@sentry/node';
import isEmpty from 'lodash.isempty';
import consola from 'consola';

export default class Controller {
  constructor(model) {
    this.model = model;
    this.fillables = [];
    this.protected = [];
    this.create = this.create.bind(this);
    this.findOne = this.findOne.bind(this);
  }

  /**
   * Create a new instance of a model in database
   *
   * @param {Request} req the Http request object
   * @param {Response} res the Http response object
   * @returns {Object} object containing the status code, message and data
   * @memberof Controller
   */
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

  findAll(name) {
    return (req, res) => this.tryCatchHandler(res, async () => {
      const data = await this.model.findAll();
      name = name || `${this.model.name}s`;
      return {
        message: isEmpty(data) ? `No record of ${name.toLowerCase()} found` : `${name} successfully retrieved`,
        data,
      };
    });
  }

  findOne(req, res) {
    return this.tryCatchHandler(res, async () => {
      const { params: { id } } = req;
      const data = await this.model.findByPk(id);
      const { name } = this.model;
      return {
        message: isEmpty(data) ? `No ${name.toLowerCase()} found` : `${name} successfully retrieved`,
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
      FORBIDDEN: 401,
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

    if (!status) {
      status = this.getStatus().SERVER_ERROR;
      message = 'Internal error ocurred, try again!';
      Sentry.captureException(error);
    }

    if (res.app.settings.env === 'development') consola.error(error);

    res.status(status)
      .json({
        success: false,
        error: message || error.errors,
      });
  }
}
