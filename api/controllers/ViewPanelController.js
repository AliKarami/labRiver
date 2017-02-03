/**
 * ViewPanelController
 *
 * @description :: Server-side logic for managing Viewpanels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment-jalaali');
var _ = require('underscore');
moment.loadPersian();

function addPersianDate(array,sourceField,destinationField) {
  for (let i=0,len=array.length;i<len;i++){
    array[i][destinationField]=moment(array[i][sourceField]).format('jYYYY/jMM/jDD - hh:mm');
  }
}
function addAuthor(arr) {
  return arr.then(function (array) {
    let promises = [];
    for (let i=0,len=array.length;i<len;i++) {
      promises.push(new Promise(function (resolve, reject) {
        User.findOne(array[i].author.userRef).exec(function (err, user) {
          if (err) reject(err);
          else {
            array[i].author.fname=user.fname;
            array[i].author.lname=user.lname;
            array[i].author.nickname=user.nickname;
            array[i].author.avatarUrl=user.avatarUrl;
            array[i].authorFullname=user.fname + ' ' + user.lname
            resolve(user);
          }
        })
      }));
    }
    return Promise.all(promises).then(function () {
      return array;
    });
  }).catch(function (err) {
    throw Error(err);
  })
}

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
    var proposal = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).exec(function (err, student) {
        if (err) reject(err);
        Proposal.findOne({author:student.id}).exec(function (err, proposal) {
          if (err) reject(err);
          resolve(proposal);
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
    var student = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).exec(function (err, student) {
        if (err) reject(err);
        resolve(student);
      })
    });
    var thesis = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).exec(function (err, student) {
        if (err) reject(err);
        Thesis.findOne({author:student.id}).exec(function (err, thesis) {
          if (err) reject(err);
          resolve(thesis);
        })
      })
    });

    var currentReport = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).exec(function (err, student) {
        if (err) reject(err);
        Report.findOne(student.currentReport).exec(function (err, currentReport) {
          if (err) reject(err);
          else resolve(currentReport)
        });
      })
    })

    var avatar = FileService.getAvatar(req.user.id);

    Promise.all([pastPapers,pastReports,student,proposal,thesis,avatar,currentReport]).then(function (data) {
      addPersianDate(data[0],'updatedAt','lastTouch');
      addPersianDate(data[1],'deadline','persianDeadline');
      data[1].splice(-1,1);
      var ret = {
        title: "WorkFlow",
        user: req.user,
        avatarFd: data[5],
        moment: moment,
        pastPapers: data[0],
        proposal: data[3],
        thesis: data[4],
        pastReports: data[1],
        reportAvailable: data[2].weeklyReporter,
        currentReport: data[6],
        selectedTab: req.query.tab?req.query.tab:0
      };
      return res.view("workflow", ret);
    })
  },
  resources : function (req, res) {
    let avatar = FileService.getAvatar(req.user.id);
    let Papers = addAuthor(Paper.find({}).populate('author'));
    let Proposals = addAuthor(Proposal.find({}).populate('author'));
    let Theses = addAuthor(Thesis.find({}).populate('author'));
    let Reports = addAuthor(Report.find({}).populate('author'));

    Promise.all([avatar,Papers,Proposals,Theses,Reports]).then(function (data) {
      addPersianDate(data[4],'deadline','persianDeadline');
      var ret = {
        title: "Resources",
        user: req.user,
        avatarFd: data[0],
        moment: moment,
        sourcePapers: data[1],
        sourceProposals: data[2],
        sourceTheses: data[3],
        sourceReports: data[4]
      };
      return res.view("resources", ret);
    });
  }
};

