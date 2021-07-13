const urlRegex =
  /^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([a-zA-Z0-9-\._~:%/?#[\]@!\$&\'\(\)*\+,;=]*)#?$/;

const whiteList = [
  'https://movies-explorer.dproject.nomoredomains.club',
  'http://movies-explorer.dproject.nomoredomains.club',
  'http://localhost:5000',
];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  optionsSuccessStatus: 200,
};

const badRequestErrorText = 'Переданы некорректные данные';
const notFoundErrorText = 'Данные с таким id не найдены';
const conflictErrorText = 'Данная почта недоступна';
const unauthorizedErrorText = 'Необходима авторизация';
const urlErrorText = 'Некорректная ссылка';
const incorrectDataErrorText = 'Неправильные почта или пароль';

module.exports = {
  urlRegex,
  corsOptions,
  badRequestErrorText,
  notFoundErrorText,
  conflictErrorText,
  unauthorizedErrorText,
  urlErrorText,
  incorrectDataErrorText,
};
