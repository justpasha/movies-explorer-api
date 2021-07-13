const { urlRegex } = require('../index');

module.exports = (value, helpers) => {
  if (!urlRegex.test(value)) {
    return helpers.error('any.invalid');
  }

  return value;
};
