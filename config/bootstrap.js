/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  _.extend(sails.hooks.http.app.locals, sails.config.http.locals);

  // add the lines from here
  // bootstrapping all the cronjobs in the crontab folder
  var schedule = require('node-schedule');
  sails.config.crontab.crons().forEach(function(item){
    schedule.scheduleJob(item.interval,sails.config.crontab[item.method]);
  });

  sails.on('lifted',function () {
    User.findOrCreate({
      nickname:'admin'
    },{
      approved:true,
      fname: 'admin',
      lname: 'admin',
      nickname: 'admin',
      email: 'admin@admin.com',
      password: '123456',
      gender: 'u',
      avatarFd: require('path').resolve(sails.config.appPath, 'assets/images/avatars') + '/default.png',
      avatarUrl: require('util').format('/images/avatars/%s', 'default.png'),
      notifications: []
    }).catch(function (err) {
      console.log('error:' + err);
    })
  })

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap! (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
