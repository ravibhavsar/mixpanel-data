var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var rp = require('request-promise');
var config = require('./config/config.json');

console.log("cofig...", config.hash);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = process.env.PORT || 8080;
var router = express.Router();

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World! 123"
  });
});

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.get('/getEventData', function(req, res, next) {
    var response = {};
    var params = req.query;
    type = params.type;
    event = params.event; 
    unit = params.unit;
    interval = params.interval;
    from_date = params.from_date;
    to_date = params.to_date;

    getEventDataFromMixPanel(event, type, unit, interval, from_date, to_date)
      .then((response) => res.json(response))
      .catch(next);
});

app.get('/getEventPropertyData', function(req, res, next) {
    var response = {};
    var params = req.query;
    type = params.type;
    event = params.event; 
    unit = params.unit;
    interval = params.interval;
    from_date = params.from_date;
    to_date = params.to_date;
    name = params.name;

    getEventPropertyDataFromMixPanel(event, type, unit, interval, from_date, to_date, name)
      .then((response) => res.json(response))
      .catch(next);
});

function getEventDataFromMixPanel(event, type, unit, interval, from_date, to_date)
{
  var request = require("request");

  var auth = "Basic " + new Buffer(config.hash + ":" + '').toString("base64");
  var options = { 
    method: 'GET',
    url: 'https://mixpanel.com/api/2.0/events/',
    qs: 
    { 
      type: type, 
      event: event, 
      unit: unit,
      interval: interval,
      // from_date: from_date,
      // to_date: to_date,
    },
    headers: 
      { 
        'cache-control': 'no-cache',
        'authorization': auth
      }
   };
    return rp(options);
}

function getEventPropertyDataFromMixPanel(event, type, unit, interval, from_date, to_date, name)
{
  var request = require("request");

  var auth = "Basic " + new Buffer(config.hash + ":" + '').toString("base64");
  var options = { 
    method: 'GET',
    url: 'https://mixpanel.com/api/2.0/events/properties/',
    qs: 
    { 
      type: type, 
      event: event, 
      unit: unit,
      name: name,
      // interval: interval,
      // from_date: from_date,
      // to_date: to_date,
    },
    headers: 
      { 
        'cache-control': 'no-cache',
        'authorization': auth
      }
   };
    return rp(options);
}


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app

app.listen(port);
console.log('Your local server has started ' + port);
