/**
 * Article.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type : {
      type : 'string',
      enum : ['submit','conferenceAccepted','journalAccepted','published'],
      required : true
    },
    title : {
      type : 'string',
      required : true
    },
    author : {
      type : 'string',
      required : true
    },
    year : {
      type: 'integer',
      required : true
    },
    abstract : {
      type : 'string',
      required : true
    },
    files : [
      {model : 'File'}
    ],
    datasets : [
      {model : 'File'}
    ],
    sourceCodes : [
      {model : 'File'}
    ],
    tags: [
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

