Template.room.helpers({
  getRoom: function () {
    return Meetings.findOne(this.roomId());
  },
});

Template.showRoom.onCreated(function () {
  var instance = this;

  instance.recognition = undefined;

  instance.autorun(function () {
    // make sure we have the user object loaded on the client
    if (!Meteor.user() || !Meteor.user().username) {
      return;
    }

    // clean up from last time just in case
    if (instance.meetingsObserve) {
      instance.meetingsObserve.stop();
    }
    if (instance.recognition) {
      instance.recognition.stop();
    }
    if (instance.recognition == undefined) {
      instance.recognition = init_recogn(instance.data.language,instance.data._id);
    }

    // NOTE: this is not reactive
    console.log(instance.data._id);
    var cursor = Meetings.find({
      _id: instance.data._id,
      recordingState: "recording",
    });

    console.log(cursor.fetch());

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
