'use strict';

require('localenv');
var async = require('async');
var request = require('superagent');

const MINTPEAKS_SERVER_URL = process.env.MINTPEAKS_SERVER_URL;

if (!MINTPEAKS_SERVER_URL) {
  throw 'Please configure the MINTPEAKS_SERVER_URL';
}

function fetch(cb) {
  console.log('at=mintpeaks.fetch');
  request.get(MINTPEAKS_SERVER_URL).end(cb);
}

function normalize_temperature(temperature) { return Number(temperature).toFixed(1); }
function normalize_humidity(humidity) { return Math.round(humidity); }

function send_temperature(temperature, cb) {
  let response = 'The current temperature in Mint Peaks is ' + normalize_temperature(temperature) + ' degrees Celsius.';

  if (Number(temperature) > 24) {
    response += "It's a bit hot in here, let's get some air!";
  }

  if (Number(temperature) < 20) {
    response += "It is a bit cold in here. Consider putting on an extra layer."
  }

  cb(response);
}

function send_humidity(humidity, cb) {
  let response = 'The current humidity in Mint Peaks is ' + normalize_humidity(humidity) + ' percent.';

  if (Number(humidity) > 80) {
    response += " It's pretty humid!"
  }

  cb(response);
}

function send_status(data, cb) {
  cb('The current status in Mint Peaks is ' + normalize_temperature(data.temperature) + ' degrees Celsius and ' + normalize_humidity(data.humidity) + ' percent humidity.');
}

module.exports.get = function get(request, session, cb) {
  fetch((err, res) => {
    if (request.intent) {
      console.log('at=mintpeaks.get intent.name=' + request.intent.name);

      if (request.intent.name === 'GetTemperature') {
        return send_temperature(res.body.temperature, cb);
      }

      if (request.intent.name === 'GetHumidity') {
        return send_humidity(res.body.humidity, cb);
      }
    }

    console.log('at=mintpeaks.get');

    // Catch all
    return send_status(res.body, cb);
  });
}
