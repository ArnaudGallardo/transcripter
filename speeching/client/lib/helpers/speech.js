init_recogn = function() {

  Recognition = new webkitSpeechRecognition();

  var interim_span = document.getElementById("interim");
  var final_span = document.getElementById("final");

  var username = Meteor.user().username;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "fr-FR";
  recognition.onresult = function(event) {
      var interim_transcript = '';
      var final_transcript = '';

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      console.log(final_transcript);
      if (final_transcript !== "") {
        console.log('insert');
        Messages.insert({
          username,
          text: final_transcript,
          createdAt: new Date()
        });
      }
      //final_span.innerHTML = final_transcript;
      interim_span.innerHTML = interim_transcript;
  };
  recognition.onend = function(event) {
      console.log('end');
  };
  recognition.onerror = function(event) {
      console.log('error');
  };
  return recognition;
}

function getTime(d) {
  var date = addZero(d.getHours()) + ":" + addZero(d.getMinutes()) + ":" + addZero(d.getSeconds());
  return date;
}
