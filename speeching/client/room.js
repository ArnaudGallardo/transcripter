var recog;

Meteor.startup(function () {
  recog = init_recogn();
})

Template.room.helpers({
  getRoom: function () {
    return Meetings.findOne(this.roomId());
  },
});

Template.showRoom.onCreated(function () {
  var instance = this;

  instance.autorun(function () {
    // make sure we have the user object loaded on the client
    if (!Meteor.user() || !Meteor.user().username) {
      return;
    }

    instance.recognition = recog;

    // clean up from last time just in case
    if (instance.meetingsObserve) {
      instance.meetingsObserve.stop();
    }
    if (instance.recognition) {
      instance.recognition.stop();
    }

    // setup recognition for this time
    instance.recognition.lang = instance.data.language;
    Session.set("meetingId", instance.data._id);
    Session.set("user", Meteor.user());

    // NOTE: this is not reactive
    var cursor = Meetings.find({
      _id: instance.data._id,
      recordingState: "recording",
    });

    instance.meetingsObserve = cursor.observe({
      added: function (doc) {
        // start recording
        console.log("start recording");
        instance.recognition.start();
      },
      removed: function (doc) {
        // stop recording
        console.log("stop recording");
        instance.recognition.stop();
      },
    });
  });
});

Template.showRoom.onDestroyed(function () {
  var instance = this;

  instance.meetingsObserve.stop();
  instance.recognition.stop();
});

Template.showRoom.helpers({
  getMessages: function () {
    return Messages.find({
      meetingId: this._id
    });
  },
  isPaused: function(){
    return this.recordingState == "paused" || this.recordingState == "stopped";
  },
  isSystem: function(username){
    return username == "system";
  },
});

Template.showRoom.events({
  "click #play": function (event, instance) {
    console.log(this.recordingState);
    if (this.recordingState == "paused") {
      Messages.insert({
        text: "Meeting resumed",
        meetingId: this._id,
        username: "system",
        userId: 0
      });
    }
    if (this.recordingState == "stopped") {
      Messages.insert({
        text: "Meeting started",
        meetingId: this._id,
        username: "system",
        userId: 0
      });
    }
    Meetings.update(instance.data._id,
    {
      $set: {
        recordingState: "recording"
      }
    });
  },
  "click #pause": function (event, instance) {
    Messages.insert({
      text: "Meeting paused",
      meetingId: this._id,
      username: "system",
      userId: 0
    });
    Meetings.update(instance.data._id,
    {
      $set: {
        recordingState: "paused"
      }
    });
  },
});

Template.registerHelper('getDate', function(date) {
  return moment(date).format('MMMM Do YYYY');
});

Template.registerHelper('getHours', function(date) {
  return moment(date).format('HH:mm:ss');
});
