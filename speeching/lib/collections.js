// https://github.com/aldeed/meteor-collection2#autovalue
function dateCreatedAutoValue () {
  if (this.isInsert) {
    return new Date();
  } else if (this.isUpsert) {
    return { $setOnInsert: new Date() };
  } else {
    this.unset();  // Prevent user from supplying their own value
  }
}

Meetings = new Meteor.Collection("meetings");
Meetings.attachSchema(new SimpleSchema({
  leaderUserId: { type: Meteor.ObjectID },
  users: {
    type: [
     new SimpleSchema({
       userId: {
         type: String
       },
       isReady: {
         type: Boolean,
       }
     })
    ],
  },
  dateCreated: { type: Date, autoValue: dateCreatedAutoValue },
  subject: { type: String },
  recordingState: {
    type: String,
    allowedValues: [
      "recording",
      "paused",
      "stopped",
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
  dateCreated: { type: Date, autoValue: dateCreatedAutoValue },
  isValidated: { type: Boolean, defaultValue: false},
}));
