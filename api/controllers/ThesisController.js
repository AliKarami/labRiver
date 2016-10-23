/**
 * ThesisController
 *
 * @description :: Server-side logic for managing Theses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config : {
    actions : false,
    shortcuts : false,
    rest : false
  },
  edit: function (req, res) {
    if (req.method=='GET') {
      var ret = {
        title : 'Edit Thesis'
      }
      return res.view("Resources/Thesis",ret)
    }
    else if (req.method=='POST') {
      //create or update thesis
    }
  },
  view : function (req, res) {

  }
};

