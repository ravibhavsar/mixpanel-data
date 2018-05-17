var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var rp = require('request-promise');
var axios = require('axios');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = process.env.PORT || 8080;
var router = express.Router();

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
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
    console.log(params);
    console.log('after param log');
    type = params.type, 
    event = params.event, 
    unit = params.unit,
    interval = params.interval,
    from_date = params.from_date,
    to_date = params.to_date

    getEventDataFromMixPanel(event, type, unit, interval, from_date, to_date)
      .then((response) => res.json(response))
      .catch(next);
});

function getEventDataFromMixPanel(event, type, unit, interval, from_date, to_date)
{
  var request = require("request");

  var auth = "Basic " + new Buffer('1ffa64e79f0f6d6da82d0dd09e3fafae' + ":" + '').toString("base64");
  var options = { 
    method: 'GET',
    url: 'https://mixpanel.com/api/2.0/events/',
    qs: 
    { 
      type: type, 
      event: event, 
      unit: unit,
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
