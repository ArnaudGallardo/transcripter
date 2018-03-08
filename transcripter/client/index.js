Session.setDefault("clickedCount", 0);

Template.index.helpers({
  getClickedCount: function () {
    return Session.get("clickedCount");
  },
});

Template.index.events({
  "click #learn-more": function (event, instance) {
    Session.set("clickedCount", Session.get("clickedCount") + 1);
  },
});
