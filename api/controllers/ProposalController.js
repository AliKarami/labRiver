/**
 * ProposalController
 *
 * @description :: Server-side logic for managing Proposals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment-jalaali');
moment.loadPersian();

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  editPage: function (req, res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return res.negotiate(err);
      Proposal.findOne({author:student.id}).exec(function (err, proposal) {
        if (err) return res.negotiate(err);
        var ret = {
          title : 'Edit Proposal',
          proposal : proposal,
        }
        return res.view("Resources/Proposal",ret)
      });
    })
  },
  edit: function (req, res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return res.negotiate(err);
      var documentId = FileService.uploadFile(req,'proposal','document');
      Promise.all([documentId]).then(function (fileIds) {
        var newProposal = {
          title: req.param("title")?req.param("title"):'',
          abstract: req.param("abstract")?req.param("abstract"):'',
          tags: req.param("tags")?req.param("tags").split(','):[],
        };
        if (fileIds[0]!=undefined) {
          newProposal = {
            title: req.param("title")?req.param("title"):'',
            abstract: req.param("abstract")?req.param("abstract"):'',
            tags: req.param("tags")?req.param("tags").split(','):[],
            document: fileIds[0]
          };
        }
        Proposal.update({author:student.id},newProposal).exec(function (err, updatedProposal) {
          if (err) return res.negotiate(err);
          var ret = {
            title: "WorkFlow",
            moment: moment
          };
          return res.view("workflow", ret);
        })
      })
    })
  },
  view : function (req, res) {

  }
};

