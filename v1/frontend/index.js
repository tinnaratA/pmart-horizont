var  express = require("express");
var multer  = require('multer');
var app = express();
var morgan = require('morgan');

var bodyParser = require('body-parser');
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({ verify: rawBodySaver , limit: '50mb'}));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true , limit: '50mb'}));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true }, limit: '50mb' }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan('common'));
app.use(express.static('./static'));

app.listen(2001, () => console.log('Application (Front) listening on port 2001!'));
