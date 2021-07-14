const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  createMovies,
  deleteMovie,
} = require('../controllers/movies');
const linkValidator = require('../utils/validators/linkValidator');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(linkValidator, 'custom validation'),
      trailer: Joi.string()
        .required()
        .custom(linkValidator, 'custom validation'),
      thumbnail: Joi.string()
        .required()
        .custom(linkValidator, 'custom validation'),
      movieId: Joi.number().required().integer(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovies
);

router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object()
      .keys({
        movieId: Joi.string().hex().length(24),
      })
      .unknown(true),
  }),
  deleteMovie
);

module.exports = router;
