/**
 * ViewAdminPanelController
 *
 * @description :: Server-side logic for managing Viewadminpanels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
        else {
          for (let i=0,len=users.length;i<len;i++) {
            users[i].fullname=users[i].fname + ' ' + users[i].lname;
          }
          resolve(users);
        }
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
        students: data[3]
      };
      return res.view("adminPanel", ret)
    })
  },
  makeNotif : function (req, res) {
    NotificationService.makeNotif(req.param("nickname").split(','),{
      cat : req.param("cat"),
      title : req.param("title"),
      description : req.param("description"),
      link : req.param("link"),
      date : new Date().toISOString(),
    }).then(res.redirect("/admin")).catch(function () {sails.log("makeNotif error.")})
  },
  broadcastNotif : function (req, res) {
    NotificationService.broadcastNotif({
      cat : req.param("cat"),
      title : req.param("title"),
      description : req.param("description"),
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

