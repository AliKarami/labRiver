/**
 * Proposal.js
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
      model: 'File'
    },
    tags : {
      type : 'array',
      defaultsTo: []
    },
    freeze : {
      type : 'boolean',
      defaultsTo : false
    }
  },
  beforeUpdate : function (newProposal, cb) {
    Proposal.findOne(newProposal.id).exec(function (err, originalProposal) {
      if (err || !originalProposal) {
        return cb();
      }
      //if document changed
      if (newProposal.document != originalProposal.document && originalProposal.document != null && originalProposal.document != undefined) {
        File.destroy(originalProposal.document).exec(function (err) {
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
