module.exports = {
    studentByUser: function (userid) {
      return User.findOne(userid).then(function (user) {
        return Student.findOne(user.studentRef);
      }).catch(function (error) {
        throw Error(error);
      })
    },
    userByStudent: function (studentid) {
      return User.findOne({studentRef:studentid});
    }
}

