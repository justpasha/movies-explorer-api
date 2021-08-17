const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-error');
const {
  badRequestErrorText,
  notFoundErrorText,
  conflictErrorText,
} = require('../utils/index');

const { SECRET_KEY_DEV } = require('../config');

const { JWT_SECRET } = process.env;

const createToken = (userId) => {
  const token = jwt.sign(
    { _id: userId },
    process.env.NODE_ENV !== 'production' ? SECRET_KEY_DEV : JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
  return token;
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundErrorText);
      }

      return res.status(200).send({ name: user.name, email: user.email });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundErrorText);
      }
      return res.status(200).send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(conflictErrorText));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestErrorText));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: createToken(user._id),
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(conflictErrorText));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestErrorText));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(200).send({ token: createToken(user._id) });
    })
    .catch((err) => {
      if (err.message) {
        next(new UnauthorizedError(err.message));
      }
      next(err);
    });
};

module.exports = {
  getUser,
  updateProfile,
  createUser,
  login,
};
