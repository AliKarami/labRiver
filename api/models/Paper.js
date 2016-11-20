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
      model : 'File'
    },
    dataset : {
      model : 'File'
    },
    sourceCode : {
      model : 'File'
    },
    relatedReports : {
      type: 'array'
    },
    tags: {
      type : 'array'
    }
  }
};

