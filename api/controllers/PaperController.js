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
    StudentService.studentByUser(req.user.id).then(function (student) {
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
    let documentId = FileService.uploadFile(req,'paper', 'document');
    let datasetId = FileService.uploadFile(req,'paper', 'dataset');
    let sourceCodeId = FileService.uploadFile(req,'paper', 'source');
    var student = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).then(function (student) {
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
        }).then(function (paper) {
            NotificationService.makeNotif('admin',{
              cat: 'general',
              title: 'New Paper Submited!',
              description: req.user.fname + ' ' + req.user.lname + ' added new paper: ' + req.param('title'),
              link: '', //should be paper link
              date: Date.now()
            });
            res.redirect('/panel/workflow');
        }).catch(function (err) {
          return res.negotiate(err);
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

