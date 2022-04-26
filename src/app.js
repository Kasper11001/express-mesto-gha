const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use((req, res, next) => {
  req.user = {
    _id: '6266c9635c21497ca81b895c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(usersRouter);
app.use(cardsRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server has been started');
});
