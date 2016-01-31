init_recogn = function(language, meetingId) {

  recognition = new webkitSpeechRecognition();

  var lastModifiedId;

  console.log(Meteor.user());
  var username = Meteor.user().username;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;

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
      console.log('USER:'+Meteor.userId());
      if (final_transcript !== "") {
        if (!lastModifiedId) {
          lastModifiedId = Messages.insert({
              text: final_transcript,
              meetingId: meetingId,
              username: username,
              userId: Meteor.userId(),
              isValidated: true,
          });
        }
        else {
          Messages.update(lastModifiedId, {
            $set: {
              text: final_transcript,
              meetingId: meetingId,
              username: username,
              userId: Meteor.userId(),
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
              userId: Meteor.userId(),
              isValidated: false,
          });
        }
        else {
          Messages.update(lastModifiedId, {
            $set: {
              text: interim_transcript,
              meetingId: meetingId,
              username: username,
              userId: Meteor.userId(),
              isValidated: false,
            }
          });
        }
      }
      console.log(interim_transcript);
  };
  recognition.onend = function(event) {
      console.log('end');
  };
  recognition.onerror = function(event) {
      console.log('error');
  };
  return recognition;
}
