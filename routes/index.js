var util = require('util');

var moment = require('moment-timezone');
var express = require('express');
var router = express.Router();
var db = require('../db');


// index page
router.get('/', function(req, res) {

  db.lennox.find({}).limit(10000).skip(0).toArray(function (err, docs) {

  var Time;
  var j = docs.length;

  for (var i = 0; i < j; i++){
     Time = moment(docs[i]['Time']);
     docs[i]['Time'] = Time.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
  };

    res.render('index.html', {
        data: docs
    });

  });

});


module.exports = router;
