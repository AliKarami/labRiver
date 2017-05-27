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
        return res.negotiate({
          message: info.message,
          user: user
        });
      }
      req.logIn(user, function(err) {
        if (err) res.negotiate(err);
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
    var created = null;
    User.create({
      fname: req.param("firstname"),
      lname: req.param("lastname"),
      email: req.param("email"),
      password: req.param("password"),
      nickname: req.param("nickname"),
      gender: req.param("gender")
    }).then(function (crtd) {
      created = crtd;
      return Student.create({
        userRef: created.id,
        studentNumber: req.param("studentNumber"),
        enteringYear: req.param("enteringYear"),
        fieldOfStudy: req.param("fieldOfStudy"),
        orientation: req.param("orientation"),
        degree: req.param("degree")
      })
    }).then(function (std) {
      User.update({id:created.id},{studentRef:std.id}).then(function (updated) {
        NotificationService.makeNotif('admin',{
          cat: 'general',
          title: 'New User Registered!',
          description: req.param('firstname') + ' ' + req.param('lastname') + ' registered and is waiting for approval.',
          link: '', //should be approval link
          date: Date.now()
        });
        res.redirect('/');
      })
    }).catch(function (err) {
      res.negotiate(err);
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
      User.update(req.user.id, {
        id: req.user.id,
        // Generate a unique URL where the avatar can be downloaded.
        avatarUrl: require('util').format('/images/avatars/%s', filename),

        // Grab the first file and use it's `fd` (file descriptor)
        avatarFd: uploadedFiles[0].fd
      }).then(function () {
        return res.redirect("panel");
      }).catch(function (err){
          return res.negotiate(err);
        });
    });
  },
  removeAvatar: function (req, res) {
    User.update(req.user.id, {
      id: req.user.id,
      // Generate a unique URL where the avatar can be downloaded.
      avatarUrl: require('util').format('/images/avatars/%s', 'default.png'),

      // Grab the first file and use it's `fd` (file descriptor)
      avatarFd: require('path').resolve(sails.config.appPath, 'assets/images/avatars') + '/default.png'
    }).then(function () {
      return res.redirect("panel");
    }).catch(function (err){
        if (err) return res.negotiate(err);
      });
  }
};

