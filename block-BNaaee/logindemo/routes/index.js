var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/success', (req, res) => {
  res.render('success');
})

router.get('/failed', (req, res) => {
  res.render('failed');
})

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/failed' }), (req, res) => {
  res.redirect('/success');
})

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google',
  {failureRedirect: '/failed'}), (req, res) => {
    res.redirect('/success');
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;