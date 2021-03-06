/**
 * Article.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type : {
      type : 'string',
      enum : ['submit','conferenceAccepted','journalAccepted','published'],
      required : true
    },
    title : {
      type : 'string',
      required : true
    },
    author : {
      model : 'Student',
      required : true
    },
    authors : {
        type: 'array'
    },
    year : {
      type: 'integer',
      required : true
    },
    abstract : {
      type : 'string',
      required : true
    },
    document : {
      model : 'File'
    },
    dataset : {
      model : 'File'
    },
    sourceCode : {
      model : 'File'
    },
    relatedReports : {
      type: 'array'
    },
    tags: {
      type : 'array'
    }
  },beforeUpdate : function (newPaper, cb) {
    Paper.findOne(newPaper.id).then(function (originalPaper) {
      if (!originalPaper) {
        return cb();
      }
      //if document changed
      var docPromise = new Promise(function (resolve, reject) {
        if (newPaper.document != originalPaper.document && originalPaper.document != null && originalPaper.document != undefined) {
          File.destroy(originalPaper.document).then(function () {
            resolve()
          }).catch(function (err) {
            reject(err)
          })
        } else {
          resolve();
        }
      });
      //if dataset changed
      var dsPromise = new Promise(function (resolve, reject) {
        if (newPaper.document != originalPaper.dataset && originalPaper.dataset != null && originalPaper.dataset != undefined) {
          File.destroy(originalPaper.dataset).then(function () {
            resolve()
          }).catch(function (err) {
            reject(err)
          })
        } else {
          resolve();
        }
      });
      //if sourceCode changed
      var scPromise = new Promise(function (resolve, reject) {
        if (newPaper.source != originalPaper.source && originalPaper.source != null && originalPaper.source != undefined) {
          File.destroy(originalPaper.source).then(function () {
            resolve()
          }).catch(function (err) {
            reject(err)
          })
        } else {
          resolve();
        }
      });

      Promise.all([docPromise,dsPromise,scPromise]).then(function (promises) {
        cb();
      })
    }).catch(function (err) {
      return cb();
    })
  }
};

