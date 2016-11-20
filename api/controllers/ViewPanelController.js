/**
 * ViewPanelController
 *
 * @description :: Server-side logic for managing Viewpanels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment-jalaali');
moment.loadPersian();

function viewSupervisor(uid) {
  return new Promise(function (resolve, reject) {
    User.findOne(uid).exec(function (err, user) {
      if (err) return reject(err);
      else {
        if (user.studentRef)
        Student.findOne(user.studentRef).exec(function (err, student) {
          if (err) return reject(err);
          else {
            var sup, supOf;
            if (student.supervisor) {
              Student.findOne(student.supervisor).exec(function (err, supe) {
                if (err) return reject(err);
                else sup = supe;
                return resolve([sup.studentNumber,]);
              })
            }
            else if (student.supervisorOf) {
              Student.findOne(student.supervisorOf).exec(function (err, supeOf) {
                if (err) return reject(err);
                else supOf = supeOf;
                return resolve([,supOf.studentNumber]);
              })
            }
            else return resolve([,]);
          }
        });
        else return resolve([,]);
      }
    })
  })
}

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  main : function (req,res) {

    FileService.getAvatar(req.user.id).then(function (avUrl) {
      NotificationService.getNotifs(req.user.id).then(function (notifs) {
        viewSupervisor(req.user.id).then(function (supers) {
          var ret = {
            title: 'Panel',
            user: req.user,
            avatarFd: avUrl,
            notifs: notifs,
            date: moment().format('jYYYY/jM/jD dddd'),
            moment: moment,
            supervisor : supers[0],
            supervisorOf : supers[1]
          };
          return res.view("panel", ret)
        }).catch(function (reason) {
          sails.log('viewSupervisor err: ' + reason);
        })
      }),function (rsn) {
        return res.negotiate(rsn)
      }
    },function (reason) {
      return res.negotiate(reason)
    });
  },
  workflow : function (req, res) {
    var pastPapers = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).exec(function (err, student) {
        if (err) reject(err);
        Paper.find({author:student.id}).exec(function (err, papers) {
          if (err) reject(err);
          resolve(papers);
        })
      })
    });
    var pastReports = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).exec(function (err, student) {
        if (err) reject(err);
        Report.find({author:student.id}).exec(function (err, reports) {
          if (err) reject(err);
          resolve(reports);
        })
      })
    });
    Promise.all([pastPapers,pastReports]).then(function (pastData) {
      var ret = {
        title: "WorkFlow",
        moment: moment,
        pastPapers: pastData[0],
        pastReports: pastData[1]
      };
      return res.view("workflow", ret);
    })
  },
  resources : function (req, res) {
    var ret = {
      title: "Resources",
      moment: moment
    };
    return res.view("resources", ret);
  }
};

