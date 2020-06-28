export default (errors, label, message) => {
  const err = errors[0];

  switch (err.type) {
    case 'string.regex.base':
      return message || `${label || err.path} is invalid`;
    default:
      return message || err;
  }
};
