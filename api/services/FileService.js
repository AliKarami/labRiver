module.exports = {
  getAvatar: function (uid) {
    return new Promise(function (resolve,reject) {
      User.findOne(uid).exec(function (err, user) {
        if (err) reject(err);
        else {
            resolve(user.avatarUrl);
        }
      })
    });
  }
};
