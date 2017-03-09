var moment = require('moment-timezone');
var express = require('express');
var router = express.Router();
var db = require('../db');


router.get('/', function(req,res) {
  res.render('index.html');
});

router.get('/furnace', function(req,res) {
  res.render('furnace.html');
});

router.get('/temperatures', function(req,res) {
  res.render('temperatures.html');
});

router.get('/nav', function(req,res) {
  res.render('nav.html');
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



router.get('/gTemperatures', function(req,res) {
  var title = req.query['title'];
  var hours = req.query['hours'];
  var date = new Date();

  if (hours) {
    date.setHours(date.getHours() - hours);
  } else {
    date.setHours(date.getHours() - 168);
  }
  var isodate = date.toISOString();

  db.sensors.find({"Time":{ $gt : isodate }}, function(err, data){
    if(err){res.send(err);}

    var response = [];
    var docs = [];
    var arrayLength = data.length;
    var myhash = {};
    var time = "";

    var i = 0;
    myhash['Time'] = data[i].Time;
    if (data[i].Data && data[i].Device_id) myhash[data[i].Device_id] = data[i].Data;
    if (data[i].Indoor_Temp && data[i].Device_id) myhash[data[i].Device_id] = data[i].Indoor_Temp;
    if (data[i].Temperature && data[i].Device_id) myhash[data[i].Device_id] = data[i].Temperature;

    for (i = 1; i < arrayLength; i++) {
        if (data[i].Time === data[i-1].Time) {} else {response.push(myhash); myhash = {};}

        myhash['Time'] = data[i].Time;
        if (data[i].Data && data[i].Device_id) myhash[data[i].Device_id] = data[i].Data;
        if (data[i].Indoor_Temp && data[i].Device_id) myhash[data[i].Device_id] = data[i].Indoor_Temp;
        if (data[i].Temperature && data[i].Device_id) myhash[data[i].Device_id] = data[i].Temperature;
    }

    // limit to 1440 values the returned array
    for (i=0; i < response.length; i++) {
      if((i % Math.round(response.length / 1440)) === 0){
        docs.push(response[i]);
      }
    }
    // convert all timezones
    for (i=0; i < docs.length; i++) {
      docs[i]['Time'] = moment(docs[i]['Time']).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
    }

    res.render('gTemperatures.html', {
        id: title,
        title: title,
        data: docs
    });
  });
});



router.get('/gFurnace', function(req,res) {
  var title = req.query['title'];
  var hours = req.query['hours'];
  var date = new Date();

  if (hours) {
    date.setHours(date.getHours() - hours);
  } else {
    date.setHours(date.getHours() - 168);
  }
  var isodate = date.toISOString();


  db.sensors.find({"Device_id":"Lennox","Time":{ $gt : isodate }}).toArray(function (err, docs) {

    var Time;
    var data = [];

    for (var i = 0; i < docs.length; i++){
       if((i % Math.round(docs.length / 1440)) === 0){
         SearchTime = docs[i]['Time'];
         Time = moment(docs[i]['Time']);
         docs[i]['Time'] = Time.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
         data.push(docs[i]);

       }
    };

    var Last_Status = 0;
    var lastevent = {};
    var allevents = [];
    for (var i = 0; i < data.length; i++){
      if (Last_Status == 0 && data[i]['System_Status'] == 1){
        lastevent['start'] = data[i]['Time'];
      }
      if (Last_Status == 1 && data[i]['System_Status'] == 0){
        lastevent['stop'] = data[i]['Time'];
        allevents.push(lastevent);
        lastevent = {};
      }
      Last_Status = data[i]['System_Status'];
    };

    res.render('gFurnace.html', {
        id: title,
        title: title,
        data: data,
        events: allevents
    });

  });

});




module.exports = router;
