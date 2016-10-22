module.exports = {
  getNotifs: function (uid) {
    return new Promise(function (resolve, reject) {
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
  },
  broadcastNotif: function (notif) {
    return new Promise(function (resolve, reject) {
      User.find().exec(function (err, users) {
        if (err) return reject(err);
        else {
          while (users.length > 0) {
            var user = users.pop();
            user.notifications.push({
              cat: notif.cat,
              title: notif.title,
              link: notif.link,
              date: notif.date
            });
            user.save(function (err) {
              if (err) return reject(err);
            })
          }
          return resolve();
        }
      })
    })
  },
  makeNotif: function (nicknames, notif) {
    return new Promise(function (resolve, reject) {
      nicknames.forEach(function (nick) {
        User.findOne({nickname: nick}).exec(function (err, user) {
          if (err) reject(err);
          else {
            user.notifications.push({
              cat: notif.cat,
              title: notif.title,
              link: notif.link,
              date: notif.date
            });
            user.save(function (err) {
              if (err) return reject(err);
            });
          }
        })
      })
      return resolve();
    })
  }
}
