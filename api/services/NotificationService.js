module.exports = {
  getNotifs: function (uid) {
    return new Promise(function (resolve,reject) {
      User.findOne(uid).exec(function (err, user) {
        if (err) reject(err);
        else {
          if (!user.notifications) resolve([]);
          else {
            resolve(user.notifications);
          }
        }
      })
    });
  }
};
