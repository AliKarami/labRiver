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
    document : {
      model : 'File'
    },
    relatedPapers : [
      {model : 'Paper'}
    ],
    tags : {
      type : 'array',
      defaultsTo: []
    }
  },
  beforeUpdate : function (newReport, cb) {
    Report.findOne(newReport.id).exec(function (err, originalReport) {
      if (err || !originalReport) {
        return cb();
      }
      //if document changed
      if (newReport.document != originalReport.document && originalReport.document != null && originalReport.document != undefined) {
        File.destroy(originalReport.document).exec(function (err) {
          if (err)
            return err;
          cb();
        })
      } else {
        cb();
      }
    })
  }
};

