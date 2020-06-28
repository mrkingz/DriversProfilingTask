import db from '../database/models';
import Controller from './controller';

const { User } = db;

class AuthController extends Controller {
  constructor() {
    super(User);
    this.fillables = ['firstname', 'lastname', 'email', 'password'];
    this.checkEmail = this.checkEmail.bind(this);
  }

  /**
   * Check if email has been used
   *
   * @param {Request} req the Http request object
   * @param {Response} res the Http response object
   * @param {Function} next express next function to delegate request to the next controller
   * @memberof AuthController
   */
  checkEmail(req, res, next) {
    return this.tryCatchHandler(res, async () => {
      const { body: { email } } = req;
      const emailAddress = await User.findOne({ where: { email } });

      if (emailAddress) {
        const error = new Error();
        error.errors = { email: 'Email address has been used' };
        error.status = this.getStatus().CONFLICT;
        throw error;
      }
      return next;
    });
  }
}

export default new AuthController();
