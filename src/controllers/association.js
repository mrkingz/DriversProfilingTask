import db from '../database/models';
import Controller from './controller';

const { Association } = db;

class AssociationController extends Controller {
  constructor() {
    super(Association);
  }
}
export default new AssociationController();
