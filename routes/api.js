var util = require('util');
var express = require('express');
var router = express.Router();
var db = require('../db');
var mongojs = require('mongojs');


// Get Sensors Data
router.get('/sensors', function(req, res, next){
  //res.json(req.query);

  db.sensors.find(req.query, function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data);
  });

});

// Get all Timeseries
router.get('/sensors/timeseries', function(req, res, next){
  db.sensors.find({Device_id: 'Lennox'},{Time: 1}, function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data);
  });

});

// Get all Timeseries
router.get('/sensors/temperatures', function(req, res, next){
  db.sensors.find({}, function(err, data){
    if(err){res.send(err);}

    var response = [];
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

    res.json(response);


  });

});

// Get one data point
router.get('/sensors/:id', function(req, res, next){
  db.sensors.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data);
  });
});

// Save data
router.post('/sensors', function(req, res, next){
  var data = req.body;
  db.sensors.save(data,function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data)
  });
});

// Delete Task
router.delete('/sensors/:id', function(req, res,next){
  db.sensors.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data)
  });
});


module.exports = router;
