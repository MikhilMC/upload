const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET home page. */
router.get('/', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      res.render('index', { title: 'Express', users: false });
    }
    res.render('index', { title: 'Express', users });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;
