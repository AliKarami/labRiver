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
    var ret = {title: 'Admin'};
    return res.view("adminPanel", ret)
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
  }
};

