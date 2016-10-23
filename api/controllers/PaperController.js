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
  new : function (req, res) {
    if (req.method=='GET') {
      var ret = {
        title : 'New Paper'
      }
      return res.view("Resources/Paper",ret)
    }
    else if (req.method=='POST') {
      Paper.create({
        type: req.param("type"),
        title: req.param("title"),
        authors: req.param("authors").split(','),
        year: req.param("year"),
        abstract: req.param("abstract"),
        tags: req.param("tags").split(',')
      }).exec(function (err, paper) {
        if (err) return err;
        else
          res.redirect('/panel/workflow');
      })
    }
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

