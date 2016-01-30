Meetings = new Meteor.Collection("meetings");
Meetings.attachSchema(new SimpleSchema({
  leaderUserId: { type: [Meteor.ObjectID] },
  users: {
    type: [
      new SimpleSchema({
        userId: { type: Meteor.ObjectID },
        color: { type: String },
      }),
    ],
  },
  recordingState: {
    type: String,
    allowedValues: [
      "recording",
      "paused",
      "ended",
    ],
  },
  language: {
    type: String,
  },
}));

Messages = new Meteor.Collection("messages");
Messages.attachSchema(new SimpleSchema({
  userId: { type: Meteor.ObjectID },
  username: { type: String },
  meetingId: { type: Meteor.ObjectID },
  text: { type: String },
}));
