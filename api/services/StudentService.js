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
    userBySID: function (sid) {
      return Student.findOne({studentNumber:sid}).then(function (student) {
        return User.findOne(student.userRef);
      }).catch(function (error) {
        throw Error(error);
      })
    },
    userByStudent: function (studentid) {
      return User.findOne({studentRef:studentid});
    }
}

