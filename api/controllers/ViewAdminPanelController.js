/**
 * ViewAdminPanelController
 *
 * @description :: Server-side logic for managing Viewadminpanels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  main : function (req, res) {
    var unapprovedUsers = new Promise(function (resolve, reject) {
      User.find({approved: false}).exec(function (err, users) {
        if (err) reject(err);
        resolve(users);
      })
    });
    var Proposals = new Promise(function (resolve, reject) {
      Proposal.find().exec(function (err, proposals) {
        if(err) reject(err);
        resolve(proposals);
      })
    });
    var Theses = new Promise(function (resolve, reject) {
      Thesis.find().exec(function (err, theses) {
        if(err) reject(err);
        resolve(theses);
      })
    });
    var Students = new Promise(function (resolve, reject) {
      Student.find().exec(function (err, students) {
        if(err) reject(err);
        resolve(students);
      })
    });
    var avatar = FileService.getAvatar(req.user.id);

    Promise.all([unapprovedUsers,Proposals,Theses,Students,avatar]).then(function (data) {
      var ret = {
        title: 'Admin',
        user: req.user,
        avatarFd: data[4],
        users: data[0],
        proposals: data[1],
        theses: data[2],
        students: data[3]
      };
      return res.view("adminPanel", ret)
    })
  },
  makeNotif : function (req, res) {
    NotificationService.makeNotif(req.param("nickname").split(','),{
      cat : req.param("cat"),
      title : req.param("title"),
      link : req.param("link"),
      date : new Date().toISOString(),
    }).then(res.redirect("/admin")).catch(function () {sails.log("makeNotif error.")})
  },
  broadcastNotif : function (req, res) {
    NotificationService.broadcastNotif({
      cat : req.param("cat"),
      title : req.param("title"),
      link : req.param("link"),
      date : new Date().toISOString(),
    }).then(res.redirect("/admin")).catch(function (err) {sails.log("broadcastNotif error: " + err)})
  },
  setSupervisor : function (req, res) {
    var whoSID,whomSID;
    User.findOne({nickname:req.param("who")}).exec(function (err, user) {
      if (err) return err;
      else {
        whoSID = user.studentRef;
        User.findOne({nickname:req.param("whom")}).exec(function (err, user) {
          if (err) return err;
          else {
            whomSID = user.studentRef;
            Student.update(whoSID,{supervisorOf:whomSID}).exec(function (err, updated) {
              if (err) return err;
            })
            Student.update(whomSID,{supervisor:whoSID}).exec(function (err, updated) {
              if (err) return err;
            })
          }
        });
      }
    });
    return res.redirect("/admin")
  },
  approveUser : function (req, res) {
    User.update(req.param("uid"),{approved : true}).exec(function (err, approvedUser) {
      if (err) return err;
      else {
        return res.redirect('/admin');
      }
    })
  }
};

