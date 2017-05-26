const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ut.labriver@gmail.com',
    pass: 'utlabriver'
  }
});

let _sendMail = (emailAddresses, subject, text, html)=> {

  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: '"LabRiver" <ut.labriver@gmail.com>', // sender address
      to: emailAddresses.join(', '), // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      } else
        return resolve(info)
    });
  });
};

module.exports = {
  sendMail: _sendMail,
  sendNotifMail: (emailAddresses, notifObj)=> {
    let subject = 'LabRiver: ' + notifObj.title;
    let text = 'You have new notification from LabRiver:\n' + notifObj.description;
    let html = '<p><h1>New Notification From LabRiver:</h1></p>' +
      '<p><h2>' + notifObj.title + '</h2></p>' +
      '<p><h4><a href="' + notifObj.link + '">' + notifObj.description + '</a></h4></p>';
    return _sendMail(emailAddresses, subject, text, html);
  }
}
