import isEmpty from 'lodash.isempty';

import db from '../database/models';
import Controller from './controller';

const { User, Association, Membership } = db;

class UserController extends Controller {
  constructor() {
    super(User);
    this.joinAssociation = this.joinAssociation.bind(this);
  }

  async getAssociation(id) {
    const association = await Association.findByPk(id, {
      attributes: ['id', 'name'],
      include: {
        model: User,
        as: 'members',
        attributes: ['id', 'firstname', 'lastname', 'email']
      }
    });

    if (association) {
      return association;
    }
    const error = new Error('Association does not exist');
    error.status = this.getStatus().NOT_FOUND;
    throw error;
  }

  joinAssociation(req, res) {
    return this.tryCatchHandler(res, async () => {
      let isMember = false;
      const { params: { id }, user } = req;
      const association = await this.getAssociation(id);

      if (!isEmpty(association.members))
        isMember = association.members.some(member => member.id === user.id);
      if (!isMember)
        await Membership.create({ userId: user.id, associationId: association.id });

      return {
        message: isMember
          ? 'User is already a member of this association'
          : 'User successfully added to this association',
        data: {
          association: {
            id: association.id,
            name: association.name,
            member: {
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname
            }
          }
        }
      };
    });
  }
}

export default new UserController();
