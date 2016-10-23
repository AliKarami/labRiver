/**
 * ProposalController
 *
 * @description :: Server-side logic for managing Proposals
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
        title : 'Edit Proposal'
      }
      return res.view("Resources/Proposal",ret)
    }
    else if (req.method=='POST') {
      //create proposal or update
    }
  },
  view : function (req, res) {

  }
};

