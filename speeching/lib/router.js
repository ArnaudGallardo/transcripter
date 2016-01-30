FlowRouter.route("/", {
  name: "home",
  action: function() {
    BlazeLayout.render("speeching", {content: "speech"});
  }
});
