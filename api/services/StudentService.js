module.exports = {
    studentByUser: function (userid) {
      return User.findOne(userid).then(function (user) {
        if (user.studentRef)
          return Student.findOne(user.studentRef);
        else
          return null;
      }).catch(function (error) {
        throw Error(error);
      })
    },
    studentByNickname: function (nickname) {
      return User.findOne({nickname: nickname}).then(function (user) {
        if (user.studentRef)
          return Student.findOne(user.studentRef)
        else
          return null;
      }).catch(function (error) {
        throw Error(error);
      })
    },
    userBySID: function (sid) {
      return Student.findOne({studentNumber:sid}).then(function (student) {
        return User.findOne(student.userRef);
      }).catch(function (error) {
        throw Error(error);
      })
    },
    nameBySID: function (sid) {
      return Student.findOne({studentNumber:sid}).then(function (student) {
        return User.findOne(student.userRef);
      }).then(function (user) {
        return user.fname + ' ' + user.lname;
      }).catch(function (error) {
        throw Error(error);
      })
    },
    nameByStudent: function (studentid) {
      return User.findOne({studentRef:studentid}).then(function (user) {
        return user.fname + ' ' + user.lname;
      }).catch(function (error) {
        throw Error(error);
      })
    },
    userByStudent: function (studentid) {
      return User.findOne({studentRef:studentid});
    },
    changeState: function (sid, toState) {
      return Student.findOne({studentNumber:sid}).then(function (student) {
        var currentState = student.state;
        if (currentState==toState) return true;
        else {
          var promises = [];
          if (currentState=='graduate' || toState=='graduate') {
            var reportingState = true;
            //update reporting state
            if (toState=='graduate')
              reportingState=false;
            promises.push(Student.update(student.id,{weeklyReporter:reportingState}));
          }
          if (currentState=='proposal' || toState=='proposal') {
            //update proposal freezing
            var proposalState = true;
            if (toState=='proposal')
              proposalState = false;
            promises.push(Proposal.update(student.proposal,{freeze:proposalState}));
          }
          if (currentState=='thesis' || toState=='thesis') {
            //update thesis freezing
            var thesisState = true;
            if (toState=='thesis')
              thesisState = false;
            promises.push(Thesis.update(student.thesis,{freeze:thesisState}));
          }
          promises.push(Student.update(student.id,{state:toState}));
          return Promise.all(promises);
        }
      })
    },
    stateBySID: function (sid) {
      return Student.findOne({studentNumber:sid}).then(function (student) {
        return student.state;
      }).catch(function (error) {
        throw Error(error);
      })
    }
}

