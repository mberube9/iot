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
