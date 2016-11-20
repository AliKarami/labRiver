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
    var documentId = FileService.uploadFile(req,'paper', 'document');
    var datasetId = FileService.uploadFile(req,'paper', 'dataset');
    var sourceCodeId = FileService.uploadFile(req,'paper', 'source');
      Promise.all([documentId,datasetId,sourceCodeId]).then(function (fileIds) {
        Paper.create({
          type: req.param('type'),
          title: req.param('title'),
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
  edit : function (req, res) {
    var ret = {
      title : 'Edit Paper'
    }
    return res.view("Resources/Paper",ret)
  },
  view : function (req, res) {

  }
};

