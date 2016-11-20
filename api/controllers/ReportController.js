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

  editPage : function (req, res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return res.negotiate(err);
      Report.findOne(student.currentReport).exec(function (err, currentReport) {
        if (err) return res.negotiate(err);
        var ret = {
          title : 'Weekly Report',
          report : currentReport,
          moment : moment,
          deadline: moment(currentReport.deadline).format('jYYYY/jM/jD dddd HH:mm'),
          lastModified: moment(currentReport.lastModified).format('jYYYY/jM/jD dddd HH:mm')
        }
        return res.view("Resources/Report",ret)
      });
    })
  },

  edit : function (req, res) {
    StudentService.studentByUser(req.user.id).exec(function (err, student) {
      if (err) return res.negotiate(err);

      Report.update(student.currentReport,{
        lastModified: new Date(),
        body: req.param("body")?req.param("body"):'',
        tags: req.param("tags")?req.param("tags").split(','):[]
      }).exec(function (err, updatedReport) {
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

