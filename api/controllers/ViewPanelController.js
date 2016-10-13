/**
 * ViewPanelController
 *
 * @description :: Server-side logic for managing Viewpanels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  main : function (req,res) {
    FileService.getAvatar(req.user.id,function (avFd) {
      var ret = {
        title: 'Panel',
        userid: req.user.id,
        avatarFd: avFd
      };
      return res.view("panel", ret)
    });
  }
};

