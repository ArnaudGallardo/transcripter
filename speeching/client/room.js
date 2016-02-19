var recog;
//Session.setDefault("reload", false);

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
  //Wtf is happening with this modal... Just killing it here
  $(".modal-backdrop").hide();
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
        $('#playModal').modal('hide');
        instance.recognition.start();
      },
      removed: function (doc) {
        // stop recording
        console.log("stop recording");
        console.log(instance.data._id);
        instance.recognition.stop();
      },
    });
    /*
    // NOTE: this is not reactive
    var cursor2 = Messages.find({
      meetingId: instance.data._id,
      username: { $not: "system" },
      isValidated: true,
    });

    instance.messagesObserve = cursor2.observe({
      added: function (doc) {
        // start recording
        console.log("stopstart recording");
        Session.set("reload", true);
        instance.recognition.stop();
      },
    });
    */
  });
});

Template.showRoom.onDestroyed(function () {
  var instance = this;

  instance.meetingsObserve.stop();
  //instance.messagesObserve.stop();
  instance.recognition.stop();
});

Template.showRoom.helpers({
  getMessages: function () {
    return Messages.find({
      meetingId: this._id
    });
  },
  getUsers: function () {
    var users = Meetings.findOne(this._id).users;
    var result = [];
    users.forEach(function(entry) {
      var user = Meteor.users.findOne({_id: entry.userId});
      user.isReady = entry.isReady;
      result.push(user);
    });
    return result;
  },
  leader: function () {
    return Meteor.userId() === Template.currentData().leaderUserId;
  },
  userReady: function() {
    var users = Meetings.findOne(this._id).users;
    console.log(users);
    var result = false;
    users.forEach(function(entry) {
      if (entry.userId == Meteor.userId()) {
        result = entry.isReady;
      }
    });
    return result;
  }
});

Template.showRoom.events({
  "click #play": function(event, instance) {
    $('#playModal').modal('show');
    loadAudioMeter();
  },
  "click #ready": function(event, instance) {
    //Search meeting, update users. mon id . isReady to true
    Meteor.call("setIsReady", instance.data._id, Meteor.userId(),true);
    $('#ready').prop('disabled', true);
    $('#ready').html("Ready!");
    var users = Meetings.findOne(instance.data._id).users;
    var everyoneReady = true;
    users.forEach(function(entry) {
      if (entry.isReady == false) {
        everyoneReady = false;
      }
    });
    console.log("READY?");
    console.log(everyoneReady);
    if (everyoneReady) {
      stopMeter();
      var elem = document.getElementById('chat_box');
      elem.scrollTop = elem.scrollHeight;
      Meteor.call("launchMeeting", instance.data._id, this.recordingState);
    }
  },
  "click #test": function(event, instance) {
    stopMeter();
  },
  "click #launch": function (event, instance) {
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
    var elem = document.getElementById('chat_box');
    console.log("scroll");
    elem.scrollTop = elem.scrollHeight;
  },
  "click #pause": function (event, instance) {
    var users = Meetings.findOne(instance.data._id).users;
    users.forEach(function(entry) {
      Meteor.call("setIsReady", instance.data._id, entry.userId,false);
    });
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
    var elem = document.getElementById('chat_box');
    console.log("scroll");
    elem.scrollTop = elem.scrollHeight;
  },
  "click #stop": function (event, instance) {
    Messages.insert({
      text: "Meeting stopped",
      meetingId: this._id,
      username: "system",
      userId: 0
    });
    Meetings.update(instance.data._id,
    {
      $set: {
        recordingState: "stopped"
      }
    });
    var elem = document.getElementById('chat_box');
    console.log("scroll");
    elem.scrollTop = elem.scrollHeight;
  },
  "submit #addUser": function (event, instance) {
    // Prevent default browser form submit
    event.preventDefault();
    var username = event.target.usernameForm.value;

    var findUser = Meteor.users.findOne({
      username: username,
    });

    if (findUser) {
      console.log('added:'+username);
      Meetings.update(instance.data._id,
      {
        $addToSet: {
          users: {
            userId: findUser._id,
            isReady: false,
          },
        }
      });
      $("#userModal").modal('hide');
    }
    else {
      $("#errorForm").html("<p>"+username+" not found.</p>");
    }
  },
});

Template.registerHelper('getDate', function(date) {
  return moment(date).format('MMMM Do YYYY');
});

Template.registerHelper('getHours', function(date) {
  return moment(date).format('HH:mm:ss');
});
