import Joi from '@hapi/joi';
import formatError from '../error-formatter';

export const getSignUpSchema = () => Joi.object()
  .keys(nameSchema('firstname', 'First name'))
  .keys(nameSchema('lastname', 'Last name'))
  .keys(emailSchema())
  .keys(passwordSchema());

export const getSignInSchema = () => Joi.object().keys({
  email: Joi.string()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.empty': 'E-mail address is not allowed to be empty',
    }),
  password: Joi.string()
    .required(),
});

const emailSchema = message => ({
  email: Joi.string()
    .trim()
    .required()
    .email({ tlds: { allow: false } })
    .max(30)
    .label('Email address')
    .error(errors => formatError(errors, 'Email address', message))
    .lowercase(),
});

const passwordSchema = () => {
  const schema = {
    password: Joi.string()
      .trim()
      .required()
      .min(8)
      .max(60)
      .label('Password'),
  };
  return schema;
};

const nameSchema = (path, label) => ({
  [path]: Joi.string()
    .trim()
    .required()
    .max(30)
    .custom((value, helper) => ((isValidName(value))
      ? value
      : helper.message(`${label} is not valid`)))
    .lowercase()
    .error(errors => formatError(errors)),
});

const isValidName = name => {
  const pattern = /^[\w'\-,.][^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
  return pattern.test(name);
};
