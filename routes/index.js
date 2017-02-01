var moment = require('moment-timezone');
var express = require('express');
var router = express.Router();
var db = require('../db');



router.get('/', function(req,res) {
  res.render('index.html');
});


router.get('/gCurTemp', function(req,res) {
  var device_id = req.query['device_id'];
  var title = req.query['title'];
  var varname = req.query['varname'];

  db.sensors.find({"Device_id":device_id}).sort({_id:-1}).limit(1).toArray(function (err, docs) {
    db.sensors.find({"Device_id":device_id}).sort({_id:-1}).limit(1440).toArray(function (err, docs2) {
      var temp_trend = "[" + Math.round(docs2[0][varname]);
      for (var i=1; i < docs2.length; i++){
        if((i % 10) === 0) {
          temp_trend = temp_trend + "," + Math.round(docs2[i][varname]);
        }
      }
      temp_trend = temp_trend + "]";
      res.render('gCurTemp.html', {
        id: title,
        title: title,
        temperature: docs[0][varname],
        sparkline: temp_trend
      });
    });
  });
});

router.get('/gCurWeather', function(req,res) {
  var device_id = req.query['device_id'];
  var title = req.query['title'];
  var varname = req.query['varname'];
  var varname2 = req.query['varname2'];

  db.sensors.find({"Device_id":device_id}).sort({_id:-1}).limit(1).toArray(function (err, docs) {
    db.sensors.find({"Device_id":device_id}).sort({_id:-1}).limit(7200).toArray(function (err, docs2) {
      var temp_trend = "[" + Math.round(docs2[0][varname]);
      for (var i=1; i < docs2.length; i++){
        if((i % 50) === 0) {
          temp_trend = temp_trend + "," + Math.round(docs2[i][varname]);
        }
      }
      temp_trend = temp_trend + "]";
      res.render('gCurWeather.html', {
        id: title,
        title: title,
        temperature: docs[0][varname],
        sparkline: temp_trend,
        weathertext: docs[0][varname2],
        weathericon: docs[0]['WeatherIcon']
      });
    });
  });
});



router.get('/gEvents', function(req,res) {
  var title = req.query['title'];

  res.render('gEvents.html', {
    id: title,
    title: title
  });

});


// first graph testing
router.get('/graph0', function(req, res) {

  db.sensors.find({"Device_id":"Lennox"}).limit(10000).skip(0).toArray(function (err, docs) {

    var Time;
    var j = docs.length;

    for (var i = 0; i < j; i++){
       Time = moment(docs[i]['Time']);
       docs[i]['Time'] = Time.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
    };

    res.render('graph0.html', {
        data: docs
    });

  });

});


module.exports = router;
