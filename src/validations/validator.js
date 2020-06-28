import Joi from '@hapi/joi';

export default async (schema, fields) => {
  try {
    const value = await Joi.attempt(fields, schema, { abortEarly: false });
    return { hasError: false, fields: value };
  } catch (err) {
    const errors = {};

    if (err.details) {
      err.details.forEach(e => {
        errors[e.path[0]] = errors[e.path[0]] || e.message.replace(/"/g, '');
      });
      return { hasError: true, errors };
    }
  }
};
