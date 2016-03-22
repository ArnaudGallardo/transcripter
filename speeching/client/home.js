Session.setDefault("friendName", "");


Template.friendType.onRendered(function() {
  console.log("STARTUP");
  Meteor.typeahead.inject();
});

Avatar.setOptions({
  fallbackType: "initials"
});

Template.home.helpers({
  getMeetings: function () {
    return Meetings.find({
      "users.userId": Meteor.userId(),
    });
  },
  isStopped: function (state) {
    return (state == "stopped");
  },
  getUserlist: function() {
    console.log('userlist');
    //Need to remove : Current user and user in request list
    //Use left join ? 
    var users = Meteor.users.find().fetch();
    var index = 0;
    users.forEach(function(entry) {
      if (entry._id !== Meteor.userId()) {
        var name;
        if (entry.profile != undefined)
          name = entry.profile.name;
        else {
          name = entry.username;
        }
        entry['value'] = name;
      }
    });
    return users;
  },
  isSelectedFriend: function() {
    return (Session.get("friendName") != "");
  },
  getFriendName: function() {
    return Session.get("friendName");
  },
  getRequestsList: function() {
    var requests = Meteor.requests.find({
      "userId": Meteor.userId(),
    }).fetch();
    requests.forEach(function(entry) {
      var user = Meteor.users.findOne({
        "_id": entry.requesterId,
      });
      var name;
      if (user.profile != undefined)
        name = user.profile.name;
      else {
        name = user.username;
      }
      entry['username'] = name;
    });
    return requests;
  },
  getFriendsList: function() {
    var requests = Meteor.friends.find({
      "userId": Meteor.userId(),
    }).fetch();
    requests.forEach(function(entry) {
      var user = Meteor.users.findOne({
        "_id": entry.friendId,
      });
      var name;
      if (user.profile != undefined)
        name = user.profile.name;
      else {
        name = user.username;
      }
      entry['username'] = name;
    });
    return requests;
  }
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
      users: [{userId: userId, isReady: false}],
      subject: subject || "No subject",
      recordingState: "paused",
      language: lang || "en-US",
    });

    console.log('meetID:'+meetingId);
    FlowRouter.go("/room/"+meetingId);

  },
  "submit #addFriend": function (event) {
    // Prevent default browser form submit
    event.preventDefault();
    var friendName = Session.get("friendName");
    if (friendName == "") {
      var friend = event.target.friendUsername.value;
      Session.set("friendName",friend);
    }
    else {
      var friend = Meteor.users.findOne({}, {"services.google.name": friendName});
      friend.requestFriendship();
      Session.set("friendName","");
      $('#friendModal').modal('hide');
    }
  },
  "click #cancelFriend": function() {
    Session.set("friendName","");
  },
  "click #downloadTxt": function (event, instance) {
    var meetingId = event.target.dataset.id;
    Router.go('/download/txt/'+meetingId);
  },
  "click #downloadPdf": function (event, instance) {
    var meetingId = event.target.dataset.id;
    //pdf.js in helpers
    generate_pdf(meetingId);
  },
  "click #acceptRequest": function (event, instance) {
    var requestId = event.target.dataset.id;
    var request = Meteor.requests.findOne({"_id": requestId});
    request.accept();
  },
  "click #denyRequest": function (event, instance) {
    var requestId = event.target.dataset.id;
    console.log(requestId);
    var request = Meteor.requests.findOne({"_id": requestId});
    request.deny();
  },
});
