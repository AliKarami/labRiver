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
  new: function (req, res) {
    var ret = {
      title : 'New Paper'
    }
    return res.view("Resources/Paper",ret)
  },
  createNew : function (req, res) {
      var documentId = new Promise(function (resolve, reject) {
        req.file('document').upload({
          // don't allow the total upload size to exceed ~25MB
          maxBytes: 25000000,
          dirname: require('path').resolve(sails.config.appPath, 'assets/files/document'),
          saveAs: function (__newFileStream, cb) {
            cb(null, 'paper-document-' + new Date().getTime() + require('path').extname(__newFileStream.filename));
          }
        },function whenDone(err, uploadedFiles) {
          if (err) {
            reject(err);
            return res.negotiate(err);
          }
          if (uploadedFiles.length > 0) {
            var _fd = uploadedFiles[0].fd.split('/');
            var filename = _fd[_fd.length-1];
            File.create({
              type: 'document',
              fileFd: uploadedFiles[0].fd,
              fileUrl: require('util').format('%s/files/document/%s', sails.config.appUrl, filename),
              uploader: req.user.id,
            }).exec(function (err,file) {
              if (err) {
                reject(err);
                return res.negotiate(err);
              }
              else resolve(file.id);
            });
          } else {
            //no file upload
            resolve(undefined);
          }
        });
      })
      Promise.all([documentId]).then(function (fileIds) {
        Paper.create({
          type: req.param('type'),
          title: req.param('title'),
          authors: req.param("authors").split(','),
          year: req.param("year"),
          abstract: req.param("abstract"),
          document: fileIds[0],
          tags: req.param("tags").split(',')
        }).exec(function (err, paper) {
          if (err) return res.negotiate(err);
          else
            res.redirect('/panel/workflow');
        })
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

