FlowRouter.route("/", {
  name: "index",
  action: function() {
    BlazeLayout.render("index", {logged: Meteor.user()});
  }
});
