/**
 * PaperController
 *
 * @description :: Server-side logic for managing Papers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  uploadPdf: function (req,res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return Promise.reject(err);
      return FileService.uploadFile(req,'paper','document').then(function (fileId) {
        return Paper.update({author:student.id},{document: fileId})
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
  new: function (req, res) {
    var ret = {
      title : 'New Paper'
    }
    return res.view("Resources/Paper",ret)
  },
  createNew : function (req, res) {
    var documentId = FileService.uploadFile(req,'paper', 'document');
    var datasetId = FileService.uploadFile(req,'paper', 'dataset');
    var sourceCodeId = FileService.uploadFile(req,'paper', 'source');
    var student = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).exec(function (err, student) {
        if (err) reject(err);
        resolve(student);
      })
    });
      Promise.all([documentId,datasetId,sourceCodeId,student]).then(function (fileIds) {
        Paper.create({
          type: req.param('type'),
          title: req.param('title'),
          author: fileIds[3].id,
          authors: req.param("authors").split(','),
          year: req.param("year"),
          abstract: req.param("abstract"),
          document: fileIds[0],
          dataset: fileIds[1],
          sourceCode: fileIds[2],
          tags: req.param("tags").split(',')
        }).exec(function (err, paper) {
          if (err) return res.negotiate(err);
          else
            res.redirect('/panel/workflow');
        })
      })
  },
  editPage : function (req, res) {
    var ret = {
      title : 'Edit Paper'
    }
    return res.view("Resources/Paper",ret)
  },
  edit : function (req, res) {
    var ret = {
      title : 'Edit Paper'
    }
    return res.view("Resources/Paper",ret)
  },
  view : function (req, res) {

  }
};

