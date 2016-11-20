/**
 * File.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type : {
      type : 'string',
      enum : ['document','dataset','source','image','other'],
      required : true
    },
    fileFd : {
      type : 'string',
      required : true
    },
    fileUrl : {
      type : 'string',
      required : true
    },
    uploader : {
      model : 'User'
    }
  }
};

