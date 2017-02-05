/**
 * ThesisController
 *
 * @description :: Server-side logic for managing Theses
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
    StudentService.studentByUser(req.user.id).then(function (student) {
      return FileService.uploadFile(req,'thesis','document').then(function (fileId) {
        return Thesis.update({author:student.id},{document: fileId})
      }).then(function () {
        res.send('successful');
      }).catch(function (err) {
        console.log(err);
      });
    })
  },
  uploadSourceCode: function (req,res) {
    StudentService.studentByUser(req.user.id).then(function (student) {
      return FileService.uploadFile(req,'thesis','source').then(function (fileId) {
        return Thesis.update({author:student.id},{sourceCode: fileId})
      }).then(function () {
        res.send('successful');
      }).catch(function (err) {
        console.log(err);
      });
    })
  },
  uploadDataset: function (req,res) {
    StudentService.studentByUser(req.user.id).then(function (student) {
      return FileService.uploadFile(req,'thesis','dataset').then(function (fileId) {
        return Thesis.update({author:student.id},{dataset: fileId})
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
    var newThesis = {
      title: req.param("title")?req.param("title"):'',
      abstract: req.param("abstract")?req.param("abstract"):'',
      tags: req.param("tags")?req.param("tags").split(','):[],
    };
    StudentService.studentByUser(req.user.id).then(function (student) {
      Thesis.update({author:student.id},newThesis).then(function (updatedThesis) {
        return res.redirect('/panel/workflow?tab=2');
      }).catch(function (err) {
        return res.negotiate(err);
      })
    });
  },
  view : function (req, res) {

  }
};

