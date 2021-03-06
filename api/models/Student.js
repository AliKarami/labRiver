/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

function nextWeek(){
  var today = new Date();
  var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+(today.getDay()==6?6:(5-today.getDay())), 23, 55);
  return nextweek;
}

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
      collection : 'Student',
      via: 'supervisor'
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
    currentReport : {
      model : 'Report'
    },
    pastReports : [
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
    weeklyReporter : {
      type : 'boolean',
      defaultsTo: true
    },
    state : {
      type: 'string',
      enum: ['preproposal','proposal','thesis','graduate'],
      defaultsTo: 'preproposal'
    }
  },
  afterCreate: function (newStudent, cb) {
    var newProposal = Proposal.create({
      author: newStudent.id
    });
    var newThesis = Thesis.create({
      author: newStudent.id
    });
    Report.create({
      deadline: nextWeek(),
      author: newStudent.id
    }).then(function (newReport) {
      Student.update(newReport.author,{currentReport:newReport.id}).then(function (updatedStudent) {
        Promise.all([newProposal,newThesis]).then(function (assignees) {
          Student.update(newStudent.id,{proposal:assignees[0].id,thesis:assignees[1].id}).then(cb());
        })
      }).catch(function (err) {
        console.log("Assigning Report to Student error: " + err);
      })
    }).catch(function (err) {
      console.log("Report Creation error: " + err);
    });

  }
};

