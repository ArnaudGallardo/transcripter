Template.room.helpers({
  getRoom: function () {
    return Meetings.findOne(this.roomId);
  },
});

Template.showRoom.helpers({
  getMessages: function () {
    var cursor = Messages.find({
      meetingId: this._id
    });
    console.log(this._id);
    console.log(cursor.fetch());
    return cursor;
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
