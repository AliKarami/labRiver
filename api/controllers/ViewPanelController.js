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
        User.findOne(array[i].author.userRef).then(function (user) {
            array[i].author.fname=user.fname;
            array[i].author.lname=user.lname;
            array[i].author.nickname=user.nickname;
            array[i].author.avatarUrl=user.avatarUrl;
            array[i].authorFullname=user.fname + ' ' + user.lname
            resolve(user);
        }).catch(function (err) {
          reject(err);
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

function viewSupervisor(user) {
  return new Promise(function (resolve, reject) {
    var supervisorSID;
    var supervisorOfSIDs = [];
    User.findOne(user.id).then(function (user) {
      if (user.nickname=='admin')
        resolve([null,[]]);
      else
        return Student.findOne(user.studentRef).populate('supervisorOf');
    }).then(function (student) {
      for (var i=0,len=student.supervisorOf.length;i<len;i++) {
        supervisorOfSIDs.push(student.supervisorOf[i].studentNumber);
      }
      if (student.supervisor)
        return Student.findOne(student.supervisor);
      else
        return null;
    }).then(function (supervisor) {
      if (supervisor)
        supervisorSID = supervisor.studentNumber;
      else
        supervisorSID = null;

      resolve([supervisorSID,supervisorOfSIDs]);
    }).catch(function (error) {
      return reject(error);
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
        viewSupervisor(req.user).then(function (supers) {
          var superOfNicks = [];
          for (var i=0,len=supers[1].length;i<len;i++) {
            superOfNicks.push(StudentService.userBySID(supers[1][i]).then(function (user) {
              return user.nickname;
            }));
          }
          Promise.all(superOfNicks).then(function (superOfNicknames) {
            var ret = {
              title: 'Panel',
              user: req.user,
              avatarFd: avUrl,
              notifs: notifs,
              date: moment().format('jYYYY/jM/jD dddd'),
              moment: moment,
              supervisor : supers[0],
              supervisorOf : supers[1],
              supervisorOfNicknames: superOfNicknames,
              selectedTab: req.query.tab?req.query.tab:0
            };
            return res.view("panel", ret)
          })
        }).catch(function (reason) {
          sails.log('viewSupervisor err: ' + reason);
          res.negotiate(reason);
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
      StudentService.studentByUser(req.user.id).then(function (student) {
        return Paper.find({author:student.id})
      }).then(function (papers) {
        resolve(papers);
      }).catch(function (error) {
        console.log(error);
        res.negotiate(error);
      })
    });
    var proposal = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).then(function (student) {
        return Proposal.findOne({author:student.id})
      }).then(function (proposal) {
        resolve(proposal);
      }).catch(function (error) {
        console.log(error);
        res.negotiate(error);
      })
    });
    var pastReports = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).then(function (student) {
        return Report.find({author:student.id});
      }).then(function (reports) {
        resolve(reports);
      }).catch(function (error) {
        console.log(error);
        res.negotiate(error);
      })
    });
    var student = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).then(function (student) {
        resolve(student);
      })
    });
    var thesis = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).then(function (student) {
        return Thesis.findOne({author:student.id})
      }).then(function (thesis) {
        resolve(thesis);
      }).catch(function (error) {
        console.log(error);
        res.negotiate(error);
      })
    });

    var currentReport = new Promise(function (resolve, reject) {
      StudentService.studentByUser(req.user.id).then(function (student) {
        return Report.findOne(student.currentReport);
      }).then(function (currentReport) {
        resolve(currentReport)
      }).catch(function (error) {
        console.log(error);
        res.negotiate(error);
      });
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
    }).catch(function (err) {
      res.negotiate(err);
    });
  },
  deleteNotification : function (req, res) {
    User.findOne(req.user.id).then(function (user) {
      user.notifications.splice(req.body.index,1);
      return User.update(req.user.id,{notifications:user.notifications})
    }).then(function () {
      res.send('success');
      return;
    }).catch(function (error) {
      res.negotiate(error);
      return;
    })
  },
  broadcastNotificationSV : function (req, res) {
    viewSupervisor(req.user).then(function (supers) {
      return Student.find({studentNumber:supers[1]})
    }).then(function (students) {
      var UIDs = [];
      for (var i=0,len=students.length;i<len;i++) {
        UIDs.push(students[i].userRef);
      }
      NotificationService.makeNotifByUID(UIDs,{
        cat : 'supervisor',
        title : req.param("title"),
        description : req.param("description"),
        link : req.param("link"),
        date : new Date().toISOString(),
      }).then(res.redirect("/panel?tab=3")).catch(function () {sails.log("makeNotif error.")})
    })
  },
  makeNotificationSV : function (req, res) {
    NotificationService.makeNotif([req.param("nickname")],{
      cat : 'supervisor',
      title : req.param("title"),
      description : req.param("description"),
      link : req.param("link"),
      date : new Date().toISOString(),
    }).then(res.redirect("/panel?tab=3")).catch(function () {sails.log("makeNotif error.")})
  }
};

