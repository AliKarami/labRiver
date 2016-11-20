/**
 * Thesis.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title : {
      type : 'string'
    },
    abstract : {
      type : 'string'
    },
    author : {
      model : 'Student'
    },
    files : [
      {model : 'File'}
    ],
    tags : {
      type : 'array'
    }
  }
};

