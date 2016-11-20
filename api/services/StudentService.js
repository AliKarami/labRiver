module.exports = {
    studentByUser: function (userid) {
      return Student.findOne({userRef:userid});
    },
    userByStudent: function (studentid) {
      return User.findOne({studentRef:studentid});
    }
}

