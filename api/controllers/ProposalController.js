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
  uploadPdf: function (req,res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return Promise.reject(err);
      return FileService.uploadFile(req,'proposal','document').then(function (fileId) {
        return Proposal.update({author:student.id},{document: fileId})
      }).then(function () {
        res.send('successful');
      }).catch(function (err) {
        console.log(err);
      });
    })
  },
  getFile: function (req,res) {
    FileService.getFileUrl(req.params['id']).then(function (fileUrl) {
      res.redirect(fileUrl);
    }).catch(function (err) {
      console.log(err);
    })
  },
  edit: function (req, res) {
    var newProposal = {
      title: req.param("title")?req.param("title"):'',
      abstract: req.param("abstract")?req.param("abstract"):'',
      tags: req.param("tags")?req.param("tags").split(','):[],
    };
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      Proposal.update({author:student.id},newProposal).exec(function (err, updatedProposal) {
        if (err) return res.negotiate(err);
        return res.redirect('/panel/workflow?tab=1');
      })
    });
  },
  view : function (req, res) {

  }
};

