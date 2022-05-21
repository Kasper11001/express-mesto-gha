const { JWT_SECRET = 'secret-key' } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    console.log('asda');
    return next(new UnauthorizedError('Необходима авторизация.'));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация.'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  console.log(payload);
  return next(); // пропускаем запрос дальше
};
