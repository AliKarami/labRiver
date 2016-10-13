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
      if (err) res.send(err);
      else {
        Student.create({
          userRef: created.id,
          studentNumber: req.param("studentNumber"),
          enteringYear: req.param("enteringYear"),
          fieldOfStudy: req.param("fieldOfStudy"),
          orientation: req.param("orientation"),
          degree: req.param("degree")
        }).exec(function (err, std) {
          if (err) res.send(err);
          else {
            User.update({id:created.id},{studentRef:std.id}).exec(function (err,updated) {
              if (err) res.send(err);
              else {
                res.redirect('/');
              }
            })

          }
        })
      }
    })
  },
  uploadAvatar: function (req, res) {

    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~6MB
      maxBytes: 6000000,
      dirname: require('path').resolve(sails.config.appPath, 'assets/images/avatars')
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      var _fd = uploadedFiles[0].fd.split('/');
      var filename = _fd[_fd.length-1];

      // Save the "fd" and the url where the avatar for a user can be accessed
      User.update(req.session.me, {

        // Generate a unique URL where the avatar can be downloaded.
        avatarUrl: require('util').format('%s/images/avatars/%s', sails.getBaseUrl(), filename),

        // Grab the first file and use it's `fd` (file descriptor)
        avatarFd: uploadedFiles[0].fd
      })
        .exec(function (err){
          if (err) return res.negotiate(err);
          return res.ok();
        });
    });
  }
};

