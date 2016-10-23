/**
 * Thesis.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title : {
      type : 'string',
      required : true
    },
    abstract : {
      type : 'string',
      required : true
    },
    author : {
      model : 'Student'
    },
    files : [
      {model : 'File'}
    ],
    tags : [
      {type : 'string'}
    ],
    comments : [
      {model : 'Comment'}
    ],
    votes : [
      {
        author : {
          model : 'User',
          required : true,
          unique : true
        },
        vote : {
          type : 'integer',
          enum : [0,1,2,3,4,5],
          required : true
        }
      }
    ]
  }
};

