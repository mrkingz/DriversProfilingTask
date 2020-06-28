import db from '../database/models';
import Controller from './controller';

const { User } = db;

class AuthController extends Controller {
  constructor() {
    super(User);
    this.fillables = ['firstname', 'lastname', 'email', 'password'];
  }
}

export default new AuthController();
