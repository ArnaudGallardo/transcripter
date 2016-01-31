function downloadTranscript () {
  // prepare yourselves
  var response = this.response;

  var meetingId = this.params.meetingId;
  console.log("meetingId:", meetingId);
  var meeting = Messages.findOne(meetingId);
  console.log("meeting:", meeting);

  // make sure it downloads right... Ted magic at work
  var filename = meeting.subject.split(' ').join('_') + ".txt";

  response.writeHead(200, {
    // 'Content-Type': 'text/tab-separated-values',
    'Content-Disposition': 'attachment; filename="' + filename +'"',
  });

  response.write("WRITE STUFF HERE");

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
