
// var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
var mongoServiceName = 'MONGODB';
var mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
    mongoUser = process.env[mongoServiceName + '_USER'];

var mongojs = require('mongojs');

var mongoURL = 'mongodb://';
mongoURL += mongoUser + ':' + mongoPassword + '@';
mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

var collections = ['lennox'];

console.log ('Connecting to URL: ' + mongoURL)
var db = mongojs(mongoURL, collections);

db.on('error', function (err) {
    console.log('database error', err)
})

db.on('connect', function () {
    console.log('database connected')
})
module.exports = db ;
