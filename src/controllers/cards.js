const Card = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({}).populate('owner')
    .then((card) => {
      if (card.length === 0) {
        res.status(NOT_FOUND).send({ message: 'Карточки отсутствуют' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      Card.find({ _id: card._id }).populate('owner')
        .then((newCard) => res.send({ data: newCard }))
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).populate('owner')
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Отправлен некоректный ID карточки' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).populate('likes').populate('owner')
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).populate('likes').populate('owner')
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  });