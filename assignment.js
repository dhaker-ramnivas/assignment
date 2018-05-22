var express = require('express');
var http       = require('http');
var app = express();
var bodyParser  = require('body-parser');
process.env.NODE_CONFIG_DIR    = 'config/';
mysqlLib = require('./routes/mysqlib.js');

var app_instance               = process.argv.NODE_APP_INSTANCE;
process.argv.NODE_APP_INSTANCE = "";
var config                       = require('config');
process.argv.NODE_APP_INSTANCE = app_instance;


app.set('port', process.env.PORT || config.get('PORT'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

var parking      = require('./routes/parking');

app.post('/api/parking', parking.registerSlot) //book slot  
app.delete('/api/parking', parking.deRegisterSlot);//do free slot
app.get('/api/parking',parking.getFreeSlot);
app.post('/api/parking/_search',parking.getDetail);//get information of car(s)

var httpServer = http.createServer(app).listen(app.get('port'), function () {
    console.log('into startServer '+app.get('port'));
});