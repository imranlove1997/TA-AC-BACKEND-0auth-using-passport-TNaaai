var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');
var Article = require('../models/article');
var passport = require('passport');

/* GET users listing. */
router.get('/', auth.loggedInUser ,function(req, res, next) {
  Article.find({ author: req.user._id }).populate('author', 'username').exec((err, articles) => {
    if(err) return next(err);
    res.render('dashboard', { articles });
  })
  })

router.get('/register', (req, res) => {
  var min = req.flash('min')[0];
  var eu = req.flash('eu')[0];
  res.render('register', { min, eu });
})

router.get('/login', (req, res) => {
  var userName = req.flash('userName')[0];
  var email = req.flash('email')[0];
  var regsuccess = req.flash('regsuccess')[0];

  var ep = req.flash('ep')[0];
  var un = req.flash('un')[0];
  var password = req.flash('password')[0];

  var permit = req.flash('permit')[0];
  res.render('login', { userName, email, regsuccess, ep, un, password, permit });
})

router.post('/register', (req, res, next) => {
  var { email, username } = req.body;
  if(!email || !username ) {
    req.flash('eu', 'Email, Username is Required');
    return res.redirect('/users/register');
  }
  User.findOne({ username: req.body.username }, (err, usName) => {
    if(err) return next(err);
    if(usName) {
      req.flash('userName', 'Username is already registered');
      return res.redirect('/users/login')
    }
    User.findOne({ email: req.body.email }, (err, user) => {
      if(err) return next(err);
      if(user) {
        req.flash('email', 'Email is already Registered');
        return res.redirect('/users/login');
      }
      if(req.body.password.length <= 5) {
        req.flash('min', 'Password Less Than 5 Chars');
        return res.redirect('/users/register');
      }
      User.create(req.body, (err, userAdded) => {
        if(err) return next(err);
        req.flash('regsuccess', 'Registered SuccessFully!!');
        return res.redirect('/users/login');
      })
    })
  })
})

router.post('/login', (req, res, next) => {
  var { username, password } = req.body;
  if(!username || !password) {
    req.flash('ep', 'Username/Password Required');
    return res.redirect('/users/login');
  }
  User.findOne({ username }, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash('un', 'Username is not registered');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash('password', 'Password is Incorrect');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      return res.redirect('/users');
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.clearCookie('connect-sid');
  return res.redirect('/users/login');
})

//github&google

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/users/login' }), (req, res) => {
  res.redirect('/users');
})

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google',
  {failureRedirect: '/users/login'}), (req, res) => {
    res.redirect('/users');
})




module.exports = router;
