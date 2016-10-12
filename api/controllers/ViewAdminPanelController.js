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
  main : function (req,res) {
    var ret = {};
    return res.view("adminPanel", ret)
  }
};

