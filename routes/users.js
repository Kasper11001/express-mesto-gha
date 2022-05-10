const router = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const { validateGetUserById, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validations');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateUser, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
