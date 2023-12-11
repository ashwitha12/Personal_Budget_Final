const express = require('express');
const controller = require('../controller/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth')
const router = express.Router();
router.get('/new', isGuest,controller.new);
router.post('/', isGuest,controller.create);
router.get('/login', isGuest,controller.getUserLogin);
router.post('/login', isGuest,controller.login);
router.get('/profile', isLoggedIn,controller.profile);
router.get('/expense', isLoggedIn,controller.getExpenseForm);
router.post('/expense', isLoggedIn,controller.postExpense);
router.get('/logout', isLoggedIn,controller.logout);
module.exports = router;