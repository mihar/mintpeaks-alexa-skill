require('localenv');
var mintpeaks = require('./lib/mintpeaks');

const APPLICATION_ID = process.env.APPLICATION_ID;

if (!APPLICATION_ID) {
  throw 'No application ID configured';
}

exports.handler = function (event, context) {
  console.log('at=handler status=starting application_id=' + APPLICATION_ID);

  try {
    if (event.session.application.applicationId !== APPLICATION_ID) {
      console.warn('at=handler event.session.application.applicationId=' + event.session.application.applicationId);
      context.fail('Invalid Application ID');
    }

    console.log('at=handler event.request.type=' + event.request.type);

    if (event.request.type === 'LaunchRequest' || event.request.type === 'IntentRequest') {
      mintpeaks.get(
        event.request,
        event.session,
        function callback(speech) {
          context.succeed(
            buildResponse(
              buildSpeechletResponse(speech)
            )
          );
        }
      );
    } else {
      context.succeed();
    }
  } catch (e) {
    context.fail('Exception: ' + e);
  }
};

function buildSpeechletResponse(output) {
  return {
    outputSpeech: {
      type: 'PlainText',
      text: output
    },
    shouldEndSession: true
  };
}

function buildResponse(speechletResponse) {
  return {
    version: '1.0',
    sessionAttributes: {},
    response: speechletResponse
  };
}
