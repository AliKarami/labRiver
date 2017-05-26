function nextWeek(){
  var today = new Date();
  var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7, 23, 55);
  return nextweek;
}

module.exports = {
  run : function(){
    console.log('weekly reports created :)');
    Student.find({weeklyReporter:true}).exec(function (err, reporterStudents) {
      if (err) console.log("Finding Reporter Students error: " + err);
      for (var i=0,len = reporterStudents.length;i<len;i++) {
        Report.create({
          deadline: nextWeek(),
          author: reporterStudents[i].id
        }).exec(function (err, newReport) {
          if (err) console.log("Report Creation error: " + err);
          Student.update(newReport.author,{currentReport:newReport.id}).exec(function (err, updatedStudent) {
            if (err) console.log("Assigning Report to Student error: " + err);
          })
        });
      }
    })
  }
};
