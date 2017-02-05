/**
 * ArticleController
 *
 * @description :: Server-side logic for managing Articles
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
    FileService.uploadFile(req,'report','document').then(function (fileId) {
      return Report.update({id:req.params['reportId']},{document: fileId})
    }).then(function () {
      return res.send('successful');
    }).catch(function (err) {
      console.log(err);
    });
  },
  getFile: function (req,res) {
    FileService.getFileUrl(req.params['id']).then(function (fileUrl) {
      res.redirect(fileUrl);
    }).catch(function (err) {
      console.log(err);
    })
  },
  edit : function (req, res) {
    var newReport = {
      body: req.param("body")?req.param("body"):'',
      tags: req.param("tags")?req.param("tags").split(','):[],
    };
    Report.update({id:req.params['reportId']},newReport).then(function (updatedReport) {
      return res.redirect('/panel/workflow?tab=3')
    }).catch(function (err) {
      return res.negotiate(err);
    })
  },

  view : function (req, res) {
    return res.redirect('https://www.google.com/#q=' + req.params['reportId']);
  }
};

