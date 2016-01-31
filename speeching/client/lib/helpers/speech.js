init_recogn = function() {

  recognition = new webkitSpeechRecognition();

  var lastModifiedId;

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = function(event) {
      console.log(event)
      var interim_transcript = '';
      var final_transcript = '';

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      var meetingId = Session.get("meetingId");
      var userId = Session.get("user")._id;
      var username = Session.get("user").username;
      console.log('USER:'+Meteor.userId());
      if (final_transcript !== "") {
        if (!lastModifiedId) {
          lastModifiedId = Messages.insert({
              text: final_transcript,
              meetingId: meetingId,
              username: username,
              userId: userId,
              isValidated: true,
          });
        }
        else {
          Messages.update(lastModifiedId, {
            $set: {
              text: final_transcript,
              meetingId: meetingId,
              username: username,
              userId: userId,
              isValidated: true,
            }
          });
          lastModifiedId = undefined;
        }
      }
      else {
        if (!lastModifiedId) {
          lastModifiedId = Messages.insert({
              text: interim_transcript,
              meetingId: meetingId,
              username: username,
              userId: userId,
              isValidated: false,
          });
        }
        else {
          Messages.update(lastModifiedId, {
            $set: {
              text: interim_transcript,
              meetingId: meetingId,
              username: username,
              userId: userId,
              isValidated: false,
            }
          });
        }
      }
      var elem = document.getElementById('chat_box');
      console.log("scroll");
      elem.scrollTop = elem.scrollHeight;
  };
  recognition.onend = function(event) {
      console.log('end');
      /*
      console.log(Session.get("reload"));
      if (Session.get("reload")) {
        recognition.start();
        Session.set("reload",false);
      }
      */
  };
  recognition.onerror = function(event) {
      console.log('error');
      console.log(event);
  };
  return recognition;
}
