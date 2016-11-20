/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    userRef : {
      model : 'User',
      required : true
    },
    studentNumber : {
      type : 'string',
      unique : true,
      required : true
    },
    supervisor :
    {
      model : 'Student'
    },
    supervisorOf :
    {
      model : 'Student'
    },
    enteringYear : {
      type : 'integer',
      required : true
    },
    fieldOfStudy : {
      type : 'string',
      required : true
    },
    orientation : {
      type : 'string'
    },
    degree : {
      type : 'string',
      enum : ['bachelor','master','phd'],
      required : true
    },
    rating : {
      type : 'integer',
      defaultsTo: 0
    },
    reports : [
      {model : 'Report'}
    ],
    papers : [
      {model : 'Paper'}
    ],
    thesis : {
      model : 'Thesis'
    },
    proposal : {
      model : 'Proposal'
    },
    datasets : {
      model : 'File'
    },
    sourceFiles : {
      model : 'File'
    }
  },
  afterCreate: function (newStudent, cb) {
    var newProposal = Proposal.create({
      author: newStudent.id
    });
    var newThesis = Thesis.create({
      author: newStudent.id
    });
    Promise.all([newProposal,newThesis]).then(function (assignees) {
      Student.update(newStudent.id,{proposal:assignees[0].id,thesis:assignees[1].id}).then(cb());
    })
  }
};

