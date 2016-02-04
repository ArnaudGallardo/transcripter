Session.setDefault("clickedCount", 0);

Template.index.helpers({
  getClickedCount: function () {
    return Session.get("clickedCount");
  },
  loggedIn: function () {
    return Meteor.userId();
  },
});

Template.index.events({
  "click #learn-more": function (event, instance) {
    Session.set("clickedCount", Session.get("clickedCount") + 1);
  },
});
