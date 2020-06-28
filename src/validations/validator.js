import Joi from '@hapi/joi';
import user from './schemas/user';

export default async (type, fields) => {
  try {
    const schemas = {
      signup: user.getSignUpSchema(),
      signin: user.getSignInSchema(),
    }
    const { value } = await Joi.attempt(fields, schemas[type], { abortEarly: false });
    return { hasError: false, fields: value };
  } catch (err) {
    const errors = {};
    if (err.details) {
      err.details.forEach(e => {
        errors[e.path[0]] =
              errors[e.path[0]] || e.message.replace(/"/g, '');
      });
      return { hasError: true, errors };
    }
  }
};
