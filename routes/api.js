var express = require('express');
var router = express.Router();
var db = require('../db');
var mongojs = require('mongojs');

// Get All Data
router.get('/sensors', function(req, res, next){
  db.sensors.find(function(err, data){
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
  console.log(req.params.id);
  db.data.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data);
  });
});

// Lennox search by Time
router.get('/lennox/perday/:date', function(req, res, next){
  console.log(req.params.date);
  db.data.find({Time: {$gte: req.params.date}},function(err, data){
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

// Get All Data
router.get('/photon', function(req, res, next){
  db.photon.find(function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data);
  });
});

// Save data
router.post('/photon', function(req, res, next){
  var data = req.body;
  db.photon.save(data,function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data)
  });
});

// Delete Task
router.delete('/photon/:id', function(req, res,next){
  db.photon.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, data){
    if(err){
      res.send(err);
    }
    res.json(data)
  });
});


module.exports = router;
