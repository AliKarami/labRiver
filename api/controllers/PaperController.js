/**
 * PaperController
 *
 * @description :: Server-side logic for managing Papers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// var multer = require('multer');
//
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, require('path').resolve(sails.config.appPath, 'assets/files/' + file.fieldname))
//   },
//   filename: function (req, file, cb) {
//     cb(null, 'Paper-' + file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
//   }
// });
//
// var upload = multer({ storage: storage });

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  new: function (req, res) {
    var ret = {
      title : 'New Paper'
    }
    return res.view("Resources/Paper",ret)
  },
  createNew : function (req, res) {
      var documentId, datasetId, sourceCodeId;
      req.file('document').upload({
        // don't allow the total upload size to exceed ~25MB
        maxBytes: 25000000,
        dirname: require('path').resolve(sails.config.appPath, 'assets/files/document')
      },function whenDone(err, uploadedFiles) {
        if (err) return res.negotiate(err);
        // If any files uploaded, add it to db.
        sails.log('uploaded files: ' + uploadedFiles.length);
        if (uploadedFiles.length > 0) {
          var _fd = uploadedFiles[0].fd.split('/');
          var filename = _fd[_fd.length-1];
          File.create({
            type: 'document',
            fileFd: uploadedFiles[0].fd,
            fileUrl: require('util').format('%s/files/document/%s', sails.config.appUrl, filename),
            author: req.user.id,
          }).exec(function (err,document) {
            if (err) return res.negotiate(err);
            else documentId = document.id;
          });
        }
      });
      Paper.create({
        type: req.param("type"),
        title: req.param("title"),
        authors: req.param("authors").split(','),
        year: req.param("year"),
        abstract: req.param("abstract"),
        document: documentId,
        tags: req.param("tags").split(',')
      }).exec(function (err, paper) {
        if (err) return res.negotiate(err);
        else
          res.redirect('/panel/workflow');
      })
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

