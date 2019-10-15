const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {

  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'You cannot pass' });
  }
};
