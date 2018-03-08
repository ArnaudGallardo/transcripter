Template.home.helpers({
  getMeetings: function () {
    return Meetings.find({
      "users.userId": Meteor.userId(),
    });
  },
  isStopped: function (state) {
    return (state == "stopped");
  },
});

Template.home.events({
  "submit #createRoom": function (event) {
    // Prevent default browser form submit
    event.preventDefault();
    var userId = Meteor.userId();
    var lang = event.target.meetingLang.value;
    var subject = event.target.meetingSubj.value;

    console.log(userId + ' created a room with settings:');
    console.log('Lang:'+lang);
    console.log('Subject:'+subject);

    var meetingId = Meetings.insert({
      leaderUserId: userId,
      users: [{userId: userId, isReady: false}],
      subject: subject || "No subject",
      recordingState: "paused",
      language: lang || "en-US",
    });

    console.log('meetID:'+meetingId);
    FlowRouter.go("/room/"+meetingId);

  },
  "click #downloadTxt": function (event, instance) {
    var meetingId = event.target.dataset.id;
    Router.go('/download/txt/'+meetingId);
  },
  "click #downloadPdf": function (event, instance) {
    var meetingId = event.target.dataset.id;
    //pdf.js in helpers
    generate_pdf(meetingId);
  },
});
