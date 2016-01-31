Template.home.helpers({
  getMeetings: function () {
    return Meetings.find({
      meetingId: this._id
    });
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
      users: [],
      subject: subject || "No subject",
      recordingState: "stopped",
      language: lang || "en-US",
    });

    console.log('meetID:'+meetingId);
    FlowRouter.go("/room/"+meetingId);

  },
});
