const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/users');
const movieRouter = require('./movies');
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.use(auth);

router.use('/movies', movieRouter);
router.use('/users', userRouter);

router.use('/', () => {
  throw new NotFoundError('Данные не найдены');
});

module.exports = router;
