Meteor.methods({
  "setIsReady": function (id,userId,value) {
    Meetings.update({_id: id, "users.userId": userId},
     {
       $set: {
         "users.$.isReady": value
       }
     }
    );
  },
  "resetReady": function (id) {
    var users = Meetings.findOne(id).users;
    console.log(id);
    users.forEach(function(entry) {
      console.log(entry.userId);
      Meetings.update({_id: id, "users.userId": entry.userId},
       {
         $set: {
           "users.$.isReady": false
         }
       }
      );
    });
  },
  "launchMeeting": function(id,recordingState) {
    if (recordingState == "paused") {
      Messages.insert({
        text: "Meeting resumed",
        meetingId: id,
        username: "system",
        userId: 0
      });
    }
    if (recordingState == "stopped") {
      Messages.insert({
        text: "Meeting started",
        meetingId: id,
        username: "system",
        userId: 0
      });
    }
    Meetings.update(id,
    {
      $set: {
        recordingState: "recording"
      }
    });
  },
})
