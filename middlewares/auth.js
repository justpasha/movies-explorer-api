const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { unauthorizedErrorText } = require('../utils/index');

const { JWT_SECRET } = process.env;
const { SECRET_KEY_DEV } = require('../config');

module.exports = (req, res, next) => {
  const jwtCookie = req.cookies.jwt;

  if (!jwtCookie) {
    throw new UnauthorizedError(unauthorizedErrorText);
  }

  const token = jwtCookie;
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV !== 'production' ? SECRET_KEY_DEV : JWT_SECRET
    );
  } catch (err) {
    throw new UnauthorizedError(unauthorizedErrorText);
  }

  req.user = payload;

  next();
};
