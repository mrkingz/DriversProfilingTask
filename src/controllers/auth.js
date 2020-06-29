import jwt from 'jsonwebtoken';
import config from 'config';
import db from '../database/models';
import Controller from './controller';

const { User } = db;

class AuthController extends Controller {
  constructor() {
    super(User);
    this.fillables = ['firstname', 'lastname', 'email', 'password'];
    this.checkEmail = this.checkEmail.bind(this);
    this.signin = this.signin.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
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
        error.error = { email: 'Email address has been used' };
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
      if (user && user.confirmPassword(password)) {
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
      const error = new Error('Invalid email address or password');
      error.status = this.getStatus().FORBIDDEN;
      throw error;
    });
  }

  extractToken(req) {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (token) {
      const match = new RegExp('^Bearer').exec(token);
      token = match ? token.split(' ').pop() : token;
    }

    return token;
  }

  checkAuth(req, res, next) {
    return this.tryCatchHandler(res, async () => {
      let message;
      const token = this.extractToken(req);
      try {
        if (token) {
          const decoded = await jwt.verify(token.trim(), config.get('auth.secret'));
          const user = await User.findByPk(decoded.userId, { attributes: { exclude: ['password'] } });
          if (user) {
            req.user = user;
            return next;
          }
          message = 'Invalid token provided';
        }
      } catch (err) {
        message = (err.toString().indexOf('jwt expired') > -1)
          ? 'You are not logged in!'
          : 'Failed to authenticate token';
      }
      const error = new Error(message || 'Token not provided');
      error.status = this.getStatus().FORBIDDEN;
      throw error;
    });
  }
}

export default new AuthController();
