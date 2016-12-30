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
              description: notif.description,
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
              description: notif.description,
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
  },
  deleteNotif: function (userid, title, date) {
    StudentService.studentByUser(userid).exec(function (err, student) {
        if (err) return err;
        var notifs = student.notifications;
        for (var i=0,len=notifs.length;i<len;i++) {
          if (notifs[i].title==title && notifs[i].date==date) {
            notifs.splice(i,1);
            break;
          }
        }
        Student.update(student.id,{notifications: notifs})
    })
  }
}
