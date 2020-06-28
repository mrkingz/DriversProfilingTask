import Controller from '../../controllers/controller';
import { getSignUpSchema } from '../../validations/schemas/user';
import validator from '../../validations/validator';

class Validation extends Controller {
  constructor() {
    super();
    this.validate = this.validate.bind(this);
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
  validate(req, res, next) {
    this.tryCatchHandler(res, async () => {
      const path = req.path.split('/').pop();

      const { hasError, errors, fields } = await validator(this.getSchema(path), req.body);
      if (hasError) {
        const error = new Error();
        error.errors = errors;
        error.status = this.getStatus().BAD_REQUEST;
        throw error;
      } else {
        req.body = fields;
        return next;
      }
    });
  }

  getSchema(path) {
    const schemas = {
      signup: getSignUpSchema(),
    };
    return schemas[path];
  }
}

export default new Validation();
