/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require ( 'bcrypt' );

module.exports = {

  attributes: {
    userRef : {
      student : {model : 'Student'},
      manager : {model : 'Manager'}
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
    nickName : {
      type : 'string',
      required : true,
      unique : true
    },
    avatar : {
      model : 'File'
    },
    gender : {
      type : 'string',
      enum : ['m','f'],
      required : true
    }
  },
  beforeCreate : function ( user, cb ) {
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
};


