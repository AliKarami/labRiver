/**
 * Report.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    assignedBy : {
      manager : {model : 'Manager'},
      student : {model : 'Student'}
    },
    assignedTo : {
      model : 'Student'
    },
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

