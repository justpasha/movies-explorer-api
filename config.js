require('dotenv').config();

const SECRET_KEY_DEV = '9a07aecf2d232ec0db73f0cb44c8c8ca';

const { MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = { SECRET_KEY_DEV, MONGO_URL };
