module.exports = {
  getAvatar: function (uid) {
    return new Promise(function (resolve,reject) {
      User.findOne(uid).exec(function (err, user) {
        if (err) reject(err);
        else resolve(user.avatarUrl);
      })
    });
  },
  getFileUrl: function (fid) {
    return new Promise(function (resolve,reject) {
      File.findOne(fid).exec(function (err, file) {
        if (err) reject(err);
        else resolve(file.fileUrl);
      })
    })
  },
  uploadFile: function (req, section, type) {
    return new Promise(function (resolve, reject) {
      req.file(type).upload({
        maxBytes: 50000000,
        dirname: require('path').resolve(sails.config.appPath, 'assets/files/' + type),
        saveAs: function (__newFileStream, cb) {
          cb(null, section + '-' + new Date().getTime() + require('path').extname(__newFileStream.filename));
        }
      },function whenDone(err, uploadedFiles) {
        if (err) {
          reject('uploading:'+err);
          return reject(err);
        }
        if (uploadedFiles.length > 0) {
          var _fd = uploadedFiles[0].fd.split('/');
          var filename = _fd[_fd.length-1];
          File.create({
            type: type,
            fileFd: uploadedFiles[0].fd,
            fileUrl: require('util').format('/files/%s/%s', type, filename),
            uploader: req.user.id,
          }).exec(function (err,file) {
            if (err) {
              reject('creating File:'+err);
              return reject(err);
            }
            else resolve(file.id);
          });
        } else {
          resolve(undefined);
        }
      });
    });
  }
};
