module.exports = {
  getNotifs: function (uid) {
    return new Promise(function (resolve, reject) {
      User.findOne(uid).then(function (user) {
        if (!user.notifications) resolve([]);
        else {
          resolve(user.notifications);
        }
      }).catch(function (err) {
        reject(err)
      })
    });
  },
  broadcastNotif: function (notif) {
    return new Promise(function (resolve, reject) {
      User.find().then(function (users) {
        while (users.length > 0) {
          var user = users.pop();

          user.notifications.push({
            cat: notif.cat,
            title: notif.title,
            description: notif.description,
            link: notif.link,
            date: notif.date
          });
          MailService.sendNotifMail([user.email],notif);
          user.save(function (err) {
            if (err) return reject(err);
          })
        }
        return resolve();
      })
    })
  },
  broadcastByDegree: function (degree, notif) {
    return new Promise(function (resolve, reject) {
      User.find({}).then(function (users) {
        while (users.length > 0) {
          var user = users.pop();
          StudentService.studentByUser(user.id).then((student)=>{
            if (student.degree == degree) {
              user.notifications.push({
                cat: notif.cat,
                title: notif.title,
                description: notif.description,
                link: notif.link,
                date: notif.date
              });
              MailService.sendNotifMail([user.email],notif);
              user.save(function (err) {
                if (err) return reject(err);
              });
            }
          })
        }
        return resolve();
      })
    })
  },
  makeNotif: function (nicknames, notif) {
    return new Promise(function (resolve, reject) {
      nicknames.forEach(function (nick) {
        User.findOne({nickname: nick}).then(function (user) {
          user.notifications.push({
            cat: notif.cat,
            title: notif.title,
            description: notif.description,
            link: notif.link,
            date: notif.date
          });
          MailService.sendNotifMail([user.email],notif);
          user.save(function (err) {
            if (err) return reject(err);
          });
        })
      })
      return resolve();
    })
  },
  makeNotifByUID: function (uids, notif) {
    return new Promise(function (resolve, reject) {
      uids.forEach(function (uid) {
        User.findOne({id: uid}).then(function (user) {
          user.notifications.push({
            cat: notif.cat,
            title: notif.title,
            description: notif.description,
            link: notif.link,
            date: notif.date
          });
          MailService.sendNotifMail([user.email],notif);
          user.save(function (err) {
            if (err) return reject(err);
          });
        })
      })
      return resolve();
    })
  },
  deleteNotif: function (userid, title, date) {
    StudentService.studentByUser(userid).then(function (student) {
        var notifs = student.notifications;
        for (var i=0,len=notifs.length;i<len;i++) {
          if (notifs[i].title==title && notifs[i].date==date) {
            notifs.splice(i,1);
            break;
          }
        }
        Student.update(student.id,{notifications: notifs})
    }).then(function (err) {
      return err
    })
  }
}
