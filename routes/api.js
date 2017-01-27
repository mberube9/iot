var express = require('express');
var router = express.Router();
var db = require('../db');

// Get All Data
router.get('/lennox', function(req, res, next){
  db.lennox.find(function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data);
  });
});

// Get one data point
router.get('/lennox/:id', function(req, res, next){
  db.data.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data);
  });
});

// Save data
router.post('/lennox', function(req, res, next){
  var data = req.body;
  db.lennox.save(data,function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data)
  });
});

// Delete Task
router.delete('/lennox/:id', function(req, res,next){
  db.lennox.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data)
  });
});

module.exports = router;
