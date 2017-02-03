/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require ( 'bcrypt' );
var fs = require('fs');

module.exports = {

  attributes: {
    approved : {
      type : 'boolean',
      defaultsTo : false
    },
    studentRef : {
      model : 'Student'
    },
    dossierRef : {
      model : 'Student'
    },
    fname : {
      type : 'string',
      required : true
    },
    lname : {
      type:'string',
      required : true
    },
    email : {
      type : 'email',
      required : true,
      unique : true
    },
    password : {
      type : 'string',
      minLength : 6,
      required : true
    },
    nickname : {
      type : 'string',
      required : true,
      unique : true
    },
    avatarFd : {
      type : 'string',
      defaultsTo : require('path').resolve(sails.config.appPath, 'assets/images/avatars') + '/default.png'
    },
    avatarUrl : {
      type : 'string',
      defaultsTo : require('util').format('/images/avatars/%s', 'default.png')
    },
    gender : {
      type : 'string',
      enum : ['m','f','u'],
      required : true
    },
    notifications : {
      type : 'array'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeCreate : function ( user, cb ) {
    user.notifications = [];
    bcrypt.genSalt ( 10, function ( err, salt ) {
      bcrypt.hash ( user.password, salt, function ( err, hash ) {
        if ( err ) {
          console.log ( err );
          cb ( err );
        } else {
          user.password = hash;
          cb ();
        }
      } );
    } );
  },
  beforeUpdate : function (newUser, cb) {
    User.findOne(newUser.id).exec(function (err, originalUser) {
      if (err || !originalUser) {
        return cb();
      }
      //if avatar changed
      if ((newUser.avatarFd != originalUser.avatarFd) && (originalUser.avatarFd != (require('path').resolve(sails.config.appPath, 'assets/images/avatars') + '/default.png'))) {
        fs.unlink(originalUser.avatarFd, function(err) {
          if (err) {
            return err;
          }
          cb();
        });
      }
      else {
        cb();
      }
    })
  },
  beforeDestroy: function (criteria, cb) {
    var studentIds = [];
    var proposalIds = [];
    var thesisIds = [];
    var reportIds = [];
    User.find(criteria).then(function (users) {
      var userIds = [];
      for (var i=0,len=users.length;i<len;i++) {
        userIds.push(users[i].id);
      }
      return Student.find({userRef:userIds})
    }).then(function (students) {
      for (var i=0,len=students.length;i<len;i++) {
        studentIds.push(students[i].id);
        proposalIds.push(students[i].proposal);
        thesisIds.push(students[i].thesis);
      }
      return Report.find({author:studentIds})
    }).then(function (reports) {
      for (var i=0,len=reports.length;i<len;i++) {
        reportIds.push(reports[i].id);
      }
      var promises = []
      promises.push(Report.destroy({id:reportIds}));
      promises.push(Thesis.destroy({id:thesisIds}));
      promises.push(Proposal.destroy({id:proposalIds}));
      promises.push(Student.destroy({id:studentIds}));
      Promise.all(promises).then(function () {
        cb();
      });
    }).catch(function (error) {
      console.log(error);
    })
  }
};


