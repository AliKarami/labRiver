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
          enum : [-1,1],
          required : true
        }
      }
    ]
  }
};

