import db from '../database/models';
import Controller from './controller';

const { User } = db;

class AuthController extends Controller {
  constructor() {
    super(User);
    this.fillables = ['firstname', 'lastname', 'email', 'password'];
    this.checkEmail = this.checkEmail.bind(this);
    this.signin = this.signin.bind(this);
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
      const user = await User.findOne({ where: { email }, attributes: ['email'] });

      if (user) {
        const error = new Error();
        error.errors = { email: 'Email address has been used' };
        error.status = this.getStatus().CONFLICT;
        throw error;
      }
      return next;
    });
  }

  /**
   * Authenticate a user
   *
   * @param {Request} req the Http request object
   * @param {Response} res the Http response object
   * @returns {Object} object containing the status code, message and data
   * @memberof AuthController
   */
  signin(req, res) {
    return this.tryCatchHandler(res, async () => {
      const { body: { email, password } } = req;
      const user = await User.findOne({ where: { email } });
      if (user.confirmPassword(password)) {
        const token = await user.generateToken();
        return {
          message: 'Authentication successful',
          data: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            token,
          },
        };
      }
    });
  }
}

export default new AuthController();
