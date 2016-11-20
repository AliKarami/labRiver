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
  editPage: function (req, res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return res.negotiate(err);
      Thesis.findOne({author:student.id}).exec(function (err, thesis) {
        if (err) return res.negotiate(err);
        var ret = {
          title : 'Edit Thesis',
          thesis : thesis,
        }
        return res.view("Resources/Thesis",ret)
      });
    })
  },
  edit: function (req, res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return res.negotiate(err);
      Thesis.update({author:student.id},{
        title: req.param("title")?req.param("title"):'',
        abstract: req.param("abstract")?req.param("abstract"):'',
        tags: req.param("tags")?req.param("tags").split(','):[]
      }).exec(function (err, updatedThesis) {
        if (err) return res.negotiate(err);
        var ret = {
          title: "WorkFlow",
          moment: moment
        };
        return res.view("workflow", ret);
      })
    })
  },
  view : function (req, res) {

  }
};

