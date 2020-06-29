import { isUuid } from 'uuidv4';
import isEmpty from 'lodash.isempty';

import Controller from '../../controllers/controller';
import { getSignUpSchema, getSignInSchema } from '../../validations/schemas/user';
import validator from '../../validations/validator';

class Validation extends Controller {
  constructor() {
    super();
    this.validateFields = this.validateFields.bind(this);
    this.validateParam = this.validateParam.bind(this);
  }

  /**
   * Validate incoming request fields
   *
   * @static
   * @param {Request} req the Http request object
   * @param {Response} res the Http response object
   * @param {Function} next express next function to delegate request to the next handler
   * @memberof Validation
   */
  validateFields(req, res, next) {
    this.tryCatchHandler(res, async () => {
      if (!isEmpty(req.body)) {
        const schema = this.getSchema(req.path.split('/').pop());

        if (schema) {
          const { hasError, errors, fields } = await validator(schema, req.body);
          if (hasError) {
            const error = new Error();
            error.errors = errors;
            error.status = this.getStatus().BAD_REQUEST;
            throw error;
          } else {
            req.body = fields;
          }
        }
      }
      return next;
    });
  }

  validateParam(req, res, next) {
    this.tryCatchHandler(res, async () => {
      const { params: { id } } = req;
      if (isUuid(id)) {
        return next;
      }
      const error = new Error('Invalid uuid provided');
      error.status = this.getStatus().BAD_REQUEST;
      throw error;
    });
  }

  getSchema(path) {
    const schemas = {
      signup: getSignUpSchema(),
      signin: getSignInSchema()
    };
    return schemas[path];
  }
}

export default new Validation();
