/**
 * Report.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    deadline : {
      type : 'date'
    },
    uploadedAt : {
      type : 'date'
    },
    lastModified : {
      type : 'date'
    },
    body : {
      type : 'string'
    },
    files : [
      {model : 'File'}
    ],
    relatedPapers : [
      {model : 'Paper'}
    ],
    tags : [
      {type : 'string'}
    ],
    feedbacks : [
      {
        author : {
          model : 'Student',
          required : true
        },
        body : {
          type : 'String',
          required : true
        }
      }
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

