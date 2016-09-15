/**
 * ArticleController
 *
 * @description :: Server-side logic for managing Articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req, res) {
    Report.create({
      type : req.param('type'),
      title : req.param('title'),
      author : req.param('author'),
      year : req.param('year'),
      abstract : req.param('abstract'),
      files : req.param('files'),
      datasets : req.param('datasets'),
      sourceCodes : req.param('sourceCodes'),
      tags : req.param('tags'),
      relatedReports : req.param('relatedReports')
    })
  },
  find: function (req, res) {

  },
  delete: function (req, res) {

  },
  addComment: function (req, res) {

  },
  addVote: function (req, res) {

  },
  update: function (req, res) {

  }
};

