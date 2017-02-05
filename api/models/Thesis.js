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
      defaultsTo: ''
    },
    abstract : {
      type : 'string',
      defaultsTo: ''
    },
    author : {
      model : 'Student'
    },
    document : {
      model : 'File'
    },
    sourceCode : {
      model : 'File'
    },
    dataset : {
      model : 'File'
    },
    tags : {
      type : 'array',
      defaultsTo: []
    },
    freeze : {
      type : 'boolean',
      defaultsTo : true
    }
  },
  beforeUpdate : function (newThesis, cb) {
    Thesis.findOne(newThesis.id).then(function (originalThesis) {
      if (!originalThesis) {
        return cb();
      }
      //if document changed
      if (newThesis.document != originalThesis.document && originalThesis.document != null && originalThesis.document != undefined) {
        File.destroy(originalThesis.document).then(function () {
        }).catch(function (err) {
          return err;
          cb();
        })
      } else {
        cb();
      }
    }).catch(function (err) {
      return cb()
    })
  }
};

