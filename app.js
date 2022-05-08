const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server has been started');
});
