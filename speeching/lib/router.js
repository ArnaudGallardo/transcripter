FlowRouter.route("/", {
  name: "index",
  action: function() {
    BlazeLayout.render("index");
  }
});

FlowRouter.route("/room/:roomId", {
  name: "room",
  action: function(params, queryParams) {
    BlazeLayout.render("room", params);
  }
});

// lol two routers :DDDDDD

Router.configure({
  notFoundTemplate: 'fakePageNotFound',
});
