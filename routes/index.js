var express = require('express');
var router = express.Router();

const {checkAuth, forwardAuth} = require('../config/auth');

// Welcome Page
router.get('/', forwardAuth, function(req, res, next) {
  res.render('welcome', { title: 'Welcome Page' });
});

// Dashboard Page
router.get("/dashboard", checkAuth, function(req, res, next){
  res.render("dashboard", { title: "Dashboard Page" });
})

module.exports = router;
