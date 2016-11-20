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
    authors : {
        type: 'array'
    },
    year : {
      type: 'integer',
      required : true
    },
    abstract : {
      type : 'string',
      required : true
    },
    document : {
      model : 'File',
      unique : true
    },
    dataset : {
      model : 'File',
      unique : true
    },
    sourceCode : {
      model : 'File',
      unique : true
    },
    relatedReports : {
      type: 'array'
    },
    tags: {
      type : 'array'
    },
    comments : {
      type : 'array'
    },
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

