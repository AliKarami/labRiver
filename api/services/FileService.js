module.exports = {
  getAvatar: function (uid ,cb) {
    User.findOne(uid).exec(function (err, user) {
      if (err) {
        console.log('error finding user');
        return cb(0);
      }
      else {
        if (!user.avatarUrl) return cb(require('util').format('%s/images/avatars/%s', sails.getBaseUrl(), 'default.png'));
        else {
          return cb(user.avatarUrl);
        }
      }
    })
  }
}
