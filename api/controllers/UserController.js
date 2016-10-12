/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  login: function (req,res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: info.message,
          user: user
        });
      }
      req.logIn(user, function(err) {
        if (err) res.send(err);
        var ret = {};
        return res.redirect('/panel');
      });

    })(req, res);
  },
  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },
  signup: function (req, res) {
    User.create({
      fname: req.param("firstname"),
      lname: req.param("lastname"),
      email: req.param("email"),
      password: req.param("password"),
      nickname: req.param("nickname"),
      gender: req.param("gender")
    }).exec(function (err, created) {
      if(err) res.send(err);
      else res.redirect('/');
    })
  }
};

