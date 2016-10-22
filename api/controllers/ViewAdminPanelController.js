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
    NotificationService.makeNotif([req.param("nickname")],{
      type : req.param("type"),
      title : req.param("title"),
      link : req.param("link"),
      date : new Date().toISOString(),
    }).then(res.redirect("/admin")).catch(function () {sails.log("makeNotif error.")})
  },
  broadcastNotif : function (req, res) {
    NotificationService.broadcastNotif({
      type : req.param("type"),
      title : req.param("title"),
      link : req.param("link"),
      date : new Date().toISOString(),
    }).then(res.redirect("/admin")).catch(function (err) {sails.log("broadcastNotif error: " + err)})
  }
};

