/**
 * Report.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    deadline : {
      type : 'datetime',
      required : true
    },
    lastModified : {
      type : 'datetime'
    },
    author: {
      model : 'Student',
      required : true
    },
    body : {
      type : 'string',
      defaultsTo: ''
    },
    files : [
      {model : 'File'}
    ],
    relatedPapers : [
      {model : 'Paper'}
    ],
    tags : {
      type : 'array',
      defaultsTo: []
    }
  }
};

