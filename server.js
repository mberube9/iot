var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var api = require('./routes/api');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var admin_user = process.env.ADMIN_USER || 'admin',
    admin_pwd = process.env.ADMIN_PASS || 'mypasswordsucks';

var app = express();

// Authenticator
app.use(function(req, res, next) {
    var auth;

    if (req.headers.authorization) {
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }

    if (!auth || auth[0] !== admin_user || auth[1] !== admin_pwd) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        res.end('Unauthorized');
    } else {
        next();
    }
});

// no caching
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname,'static')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/api', api);

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
