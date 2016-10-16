/**
 * ViewPanelController
 *
 * @description :: Server-side logic for managing Viewpanels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment-jalaali');

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  main : function (req,res) {
    FileService.getAvatar(req.user.id).then(function (avUrl) {
      NotificationService.getNotifs(req.user.id).then(function (notifs) {
        var ret = {
          title: 'Panel',
          userid: req.user.id,
          avatarFd: avUrl,
          notifs: notifs,
          date: moment().format('jYYYY/jM/jD dddd'),
          moment: moment
        };
        return res.view("panel", ret)
      }),function (rsn) {
        return res.negotiate(rsn)
      }
    },function (reason) {
      return res.negotiate(reason)
    });
  },
  workflow : function (req, res) {
    var ret = {
      title: "WorkFlow",
      moment: moment
    };
    return res.view("workflow", ret);
  },
  resources : function (req, res) {
    var ret = {
      title: "Resources",
      moment: moment
    };
    return res.view("resources", ret);
  }
};

