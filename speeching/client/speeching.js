Template.hello.helpers({

});

Template.hello.events({
  'click button': function () {
    // increment the counter when button is clicked
    var recognition = init_recogn();
    recognition.start();
  }
});

// Template.speeching

Template.speeching.helpers({
  getMessages: function () {
    return Messages.find({});
  },
});

Template.speeching.events({
  "mouseenter #setting-hover": function(event, template) {
    //console.log("mousehover", event);
    $("#setting").slideDown("fast");
  },
  "mouseleave #setting": function(event, template) {
    //console.log("mouseleave", event);
    $("#setting").slideUp("fast");
  },
  "click #create-room": function (event, instance) {
    var userId = Meteor.userId();
    Meetings.insert({
      leaderUserId: userId,
      users: [userId],
      recordingState: "stopped",
      language: "en-US",
    });
  },
});

// global stuff

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('HH:mm:ss');
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
