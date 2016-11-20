module.exports.crontab = {

  /*

   * The asterisks in the key are equivalent to the

   * schedule setting in crontab, i.e.

   * minute hour day month day-of-week year

   * so in the example below it will run every minute

   */


  crons:function()
  {
    var jsonArray = [];
    //run every saturday 23:55:00
    jsonArray.push({interval:'00 55 23 * * 6',method:'createReports'});
    // jsonArray.push({interval:'*/5 * * * * *',method:'createReports'});

    // add more cronjobs if you want like below
    // but dont forget to add a new method.
    //jsonArray.push({interval:'*/1 * * * * * ',method:'anothertest'});

    return jsonArray;

  },

  // declare the method mytest
  // and add it in the crons function
  createReports: function(){
    require('../crontab/createReports.js').run();

  }

  /*
   anothertest:function(){
   require('../crontab/anothertest.js').run();
   }
   */


};
