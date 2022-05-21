const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      Card.findById(card._id).populate('owner')
        .then((newCard) => {
          res.send({ data: newCard });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при добавлении карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена.')))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError('Можно удалять только собственные карточки'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ data: card }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate('likes').populate('owner')
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки.')))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate('likes').populate('owner')
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки.')))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
      } else {
        next(err);
      }
    });
};
