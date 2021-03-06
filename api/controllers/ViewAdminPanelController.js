/**
 * ViewAdminPanelController
 *
 * @description :: Server-side logic for managing Viewadminpanels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('underscore');

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

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  main : function (req, res) {
    var unapprovedUsers = new Promise(function (resolve, reject) {
      User.find({approved: false}).then(function (users) {
        for (let i=0,len=users.length;i<len;i++) {
          users[i].fullname=users[i].fname + ' ' + users[i].lname;
        }
        resolve(users);
      }).catch(function (err) {
        reject(err)
      })
    });
    var Proposals = addAuthor(Proposal.find().populate('author'));
    var Theses = addAuthor(Thesis.find().populate('author'));
    var Students = Student.find().populate('userRef');
    var avatar = FileService.getAvatar(req.user.id);

    Promise.all([unapprovedUsers,Proposals,Theses,Students,avatar]).then(function (data) {
      var ret = {
        title: 'Admin',
        user: req.user,
        avatarFd: data[4],
        users: data[0],
        proposals: data[1],
        theses: data[2],
        students: data[3],
        selectedTab: req.query.tab?req.query.tab:0
      };
      return res.view("adminPanel", ret)
    }).catch(function (err) {
      res.negotiate(err);
    })
  },
  makeNotif : function (req, res) {
    NotificationService.makeNotif(req.param("nickname").split(','),{
      cat : req.param("cat"),
      title : req.param("title"),
      description : req.param("description"),
      link : req.param("link"),
      date : new Date().toISOString(),
    }).then(res.redirect("/admin?tab=2")).catch(function () {sails.log("makeNotif error.")})
  },
  broadcastNotif : function (req, res) {
    NotificationService.broadcastNotif({
      cat : req.param("cat"),
      title : req.param("title"),
      description : req.param("description"),
      link : req.param("link"),
      date : new Date().toISOString()
    }).then(res.redirect("/admin?tab=2")).catch(function (err) {sails.log("broadcastNotif error: " + err)})
  },
  broadcastNotifByDegree : function (req, res) {
    NotificationService.broadcastByDegree(req.param("degree"),{
      cat: req.param("cat"),
      title : req.param("title"),
      description : req.param("description"),
      link : req.param("link"),
      date : new Date().toISOString()
    }).then(res.redirect("/admin?tab=2")).catch(function (err) {sails.log("broadcastNotifByDegree error: " + err)})
  },
  approveUsers : function (req, res) {
    var approvedUsers = req.body.users;
    var promises = [];
    for (var i=0,len=approvedUsers.length;i<len;i++) {
      promises.push(User.update(approvedUsers[i].id,{approved: true}));
    }
    return Promise.all(promises).then(function () {
      res.send('success');
      return;
    }).catch(function (error) {
      res.negotiate(error);
      return;
    })
  },
  declineUsers : function (req, res) {
    var declinedUsers = req.body.users;
    var promises = [];
    for (var i=0,len=declinedUsers.length;i<len;i++) {
      promises.push(User.destroy(declinedUsers[i].id));
    }
    return Promise.all(promises).then(function () {
      res.send('success');
      return;
    }).catch(function (error) {
      res.negotiate(error);
      return;
    })
  },
  proposalFreeze: function (req, res) {
    Student.findOne(req.body.studentId).then(function (student) {
      return Proposal.update(student.proposal,{freeze:req.body.value});
    }).then(function () {
      res.send('success');
      return;
    }).catch(function (error) {
      res.negotiate(error);
      return;
    })
  },
  thesisFreeze: function (req, res) {
    Student.findOne(req.body.studentId).then(function (student) {
      return Thesis.update(student.thesis,{freeze:req.body.value});
    }).then(function () {
      res.send('success');
      return;
    }).catch(function (error) {
      res.negotiate(error);
      return;
    })
  },
  weeklyReporting: function (req, res) {
    Student.update(req.body.studentId,{weeklyReporter:req.body.value}).then(function () {
      res.send('success');
      return;
    }).catch(function (error) {
      res.negotiate(error);
      return;
    })
  },
  setSupervisor: function (req, res) {
    Student.findOne({studentNumber:req.param('who')}).then(function (supervisor) {
      return Student.update({studentNumber:req.param('whom').split(',')},{supervisor:supervisor.id});
    }).then(function () {
      return res.redirect('/admin?tab=0')
    }).catch(function (error) {
      return res.negotiate(error);
    })
  },
  setSupervisorByNickname: function (req, res) {
    StudentService.studentByNickname(req.param('who')).then(function (supervisor) {
      var whom = req.param('whom').split(',');
      var promises = [];
      for (var i=0,len=whom.length;i<len;i++) {
        promises.push(StudentService.studentByNickname(whom[i]).then(function (supervisee) {
          return Student.update(supervisee.id,{supervisor:supervisor.id});
        }));
      }
      return Promise.all(promises);
    }).then(function () {
      return res.redirect('/admin?tab=0')
    }).catch(function (error) {
      return res.negotiate(error);
    })
  },
  changeState: function (req, res) {
    StudentService.changeState(req.body.sid, req.body.state).then(function () {
      res.send('success');
      return;
    }).catch(function (error) {
      res.negotiate(error);
    })
  }
};

