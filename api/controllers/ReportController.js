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
  new: function (req, res) {
    if (req.method=='GET') {
      var ret = {
        title : 'Submit Report',
        moment : moment,
        deadline: moment().format('jYYYY/jM/jD dddd HH:mm'),
        uploadedAt: moment().format('jYYYY/jM/jD dddd HH:mm'),
        lastModified: moment().format('jYYYY/jM/jD dddd HH:mm')
      }
      return res.view("Resources/Report",ret)
    }
    else if (req.method=='POST') {
      Report.create({
        body: req.param("body"),
        tags: req.param("tags").split(',')
      }).exec(function (err, report) {
        if (err) return err;
        else
          res.redirect('/panel/workflow');
      })
    }
  },
  view : function (req, res) {

  }
};

