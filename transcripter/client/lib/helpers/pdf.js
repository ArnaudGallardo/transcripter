generate_pdf = function(meetingId) {
  var meeting = Meetings.findOne(meetingId);
  var filename = meeting.subject.split(' ').join('_') + ".pdf";
  var doc = new jsPDF();
  //Title Bold and Black
  doc.setFontType("bold");
  doc.setFontSize(22);
  doc.text(20, 20, meeting.subject+" - "+moment(meeting.dateCreated).format('MMMM Do YYYY'));

  var compteurH = 30;
  var margin = 19;
  var sizes = [10,12];
  doc.setFont("times");
  var messages = Messages.find({meetingId:meetingId}).fetch();
  messages.forEach(function(message) {
    //If system
    if (message.username == "system") {
      doc.setTextColor(12, 227, 172);
      doc.setFontSize(8);
      doc.text(margin,compteurH,"["+moment(message.dateCreated).format('HH:mm:ss')+"] ");
      doc.text(margin+14,compteurH,message.text);
      compteurH += 7
    }
    else {
      doc.setTextColor(100);
      doc.setFontSize(sizes[0]);
      doc.text(margin,compteurH,"["+moment(message.dateCreated).format('HH:mm:ss')+"] ");
      doc.setTextColor(7, 132, 99);
      doc.text(margin+17,compteurH,message.username+":");
      doc.setTextColor(0);
      var lines = doc.setFont("times")
          .setFontSize(sizes[1])
          .splitTextToSize(message.text, 172);
      var dim = doc.getTextDimensions(lines[0]);
      //console.log(dim);
      doc.text(margin,compteurH+5,lines);
      compteurH += 7 + (dim.h/(72/25.6))*(lines.length);
    }
  });
  doc.save(filename);
}
