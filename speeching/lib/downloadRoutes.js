function downloadTranscript () {
  // prepare yourselves
  var response = this.response;

  var meetingId = this.params.meetingId;
  console.log("meetingId:", meetingId);
  var meeting = Meetings.findOne(meetingId);
  console.log("meeting:", meeting);

  // make sure it downloads right... Ted magic at work
  var filename = meeting.subject.split(' ').join('_') + ".txt";

  response.writeHead(200, {
    // 'Content-Type': 'text/tab-separated-values',
    'Content-Disposition': 'attachment; filename="' + filename +'"',
  });
  response.write(meeting.subject+" "+moment(meeting.dateCreated).format('MMMM Do YYYY')+"\n");
  var messages = Messages.find({meetingId:meetingId}).fetch();
  messages.forEach(function(message) {
    response.write("["+moment(message.dateCreated).format('HH:mm:ss')+"] ");
    response.write(message.username);
    response.write(": "+message.text+"\n");
});

  // we're done here
  response.end();
}

Router.map(function() {
  this.route("downloadTranscript", {
    path: "/download/:meetingId",
    where: "server",
    action: downloadTranscript,
  });
});
