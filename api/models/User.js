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
      defaultsTo : require('util').format('%s/images/avatars/%s', sails.config.appUrl, 'default.png')
    },
    gender : {
      type : 'string',
      enum : ['m','f'],
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
            return console.error(err);
          }
          cb();
        });
      }
      else {
        cb();
      }
    })
  }
};


