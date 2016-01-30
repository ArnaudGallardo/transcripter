Template.home.helpers({

});

Template.home.events({
  "click #addRoom": function (event, instance) {
    var userId = Meteor.userId();
    Meetings.insert({
      leaderUserId: userId,
      users: [userId],
      recordingState: "stopped",
      language: "en-US",
    });
  },
  "click #createRoom": function (event, instance) {
    var userId = Meteor.userId();
    Meetings.insert({
      leaderUserId: userId,
      users: [userId],
      recordingState: "stopped",
      language: "en-US",
    });
  },
});
